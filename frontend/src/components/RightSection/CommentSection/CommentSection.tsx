import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import CommentItem from "@/components/RightSection/CommentSection/CommentItem";
import { currentBoardIdState } from "@/recoil/atom";
import { axiosCreateComment } from "@/api/axios/axios.custom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Board } from "@/types/enum/board.category.enum";
import { IBoardInfo } from "@/types/interface/board.interface";
import useFetch from "@/hooks/useFetch";
import LoadingCircleAnimation from "@/components/loading/LoadingCircleAnimation";
import { CommentInfoDTO } from "@/types/dto/board.dto";
import { languageState } from "@/recoil/atom";
import useDebounce from "@/hooks/useDebounce";

const isOnlyWhitespace = (str: string) => {
  return str.trim() === "";
};

const CommentSection = () => {
  const [language] = useRecoilState<any>(languageState);
  const [loading, setLoading] = useState(true);
  const { debounce } = useDebounce();
  const { fetchComments } = useFetch();
  const [currentBoardId] = useRecoilState<number | null>(currentBoardIdState);
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", currentBoardId],
    queryFn: fetchComments,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    setLoading(true);
    debounce("commentsLoading", () => setLoading(false), 400);
  }, [currentBoardId]);

  const handleOnchange = (e: any) => {
    setComment(e.target.value);
  };

  const uploadComment = async () => {
    if (comment === "" || isOnlyWhitespace(comment)) {
      setComment("");
      return;
    }
    try {
      await axiosCreateComment(currentBoardId, comment);
    } catch (error) {
      setComment("");
    }
  };

  const commentMutation = useMutation(uploadComment, {
    onSuccess: async () => {
      if (comment === "" || isOnlyWhitespace(comment)) return;

      await queryClient.invalidateQueries(["comments", currentBoardId]);
      const newComments: CommentInfoDTO[] | undefined =
        await queryClient.getQueryData(["comments", currentBoardId]);

      const mainBoardCategories = [
        Board.DEFAULT,
        Board.TRENDING,
        Board.FOLLOWING,
        Board.MINE,
        Board.OTHER,
      ];

      for (let i = 0; i < mainBoardCategories.length; i++) {
        await queryClient.setQueryData(
          ["boards", mainBoardCategories[i]],
          (prevData: IBoardInfo[] | any) => {
            if (!prevData) return prevData;
            if (!newComments) return prevData;

            const updatedBoards = prevData.pages.map((page: IBoardInfo[]) =>
              page.map((board: IBoardInfo) => {
                if (board.boardId === currentBoardId && newComments) {
                  return {
                    ...board,
                    previewCommentUser:
                      newComments[newComments.length - 1].memberName,
                    previewComment: newComments[newComments.length - 1].comment,
                    commentCount: newComments.length,
                  };
                }
                return board;
              })
            );

            return { ...prevData, pages: updatedBoards };
          }
        );
      }

      setComment("");
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!event.nativeEvent.isComposing) {
        event.preventDefault();
        commentMutation.mutate();
      }
    }
  };
  if (loading || isLoading) {
    return (
      <WrapperStyled>
        <LoadingCircleAnimation />
      </WrapperStyled>
    );
  }

  return (
    <WrapperStyled>
      <CommentItemWrapperStyled>
        {comments.length > 0 ? (
          comments.map((comment: CommentInfoDTO) => (
            <CommentItem
              key={comment.commentId}
              commentId={comment.commentId}
              memberId={comment.memberId}
              memberName={comment.memberName}
              country={comment.country}
              comment={comment.comment}
              profileImageUrl={comment.profileImageUrl}
              createdAt={comment.createdAt}
              followType={comment.followType}
            />
          ))
        ) : (
          <NoCommentMessageStyled>
            {language.demandFirstComment}
          </NoCommentMessageStyled>
        )}
      </CommentItemWrapperStyled>
      <CommentInputContainerStyled>
        <input
          value={comment}
          placeholder={language.enterComment}
          maxLength={50}
          onChange={handleOnchange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => commentMutation.mutate()}>
          {language.posting}
        </button>
      </CommentInputContainerStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  flex: 1;
  width: 100%;
`;

const CommentItemWrapperStyled = styled.div`
  padding-top: 5px;
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: scroll;
  overflow-x: hidden;
`;

const NoCommentMessageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 40px);
  text-align: center;
  font-size: 2rem;
  color: var(--white);
  opacity: 0.7;
`;

const CommentInputContainerStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 40px;
  @media screen and (display-mode: standalone) {
    margin-bottom: 40px;
  }
  font-size: 1.3rem;
  border-top: 1px solid var(--transparent);
  padding-top: 2%;
  padding-bottom: 2%;
  input {
    height: 50%;
    width: 68%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--white);
    background-color: transparent;
    color: var(--white);
    outline: none;
    font-size: 13px;
    margin-top: 3px;
  }
  input::placeholder {
    font-size: 13px;
    color: var(--transparent);
  }
  button {
    font-size: 13px;
    cursor: pointer;
    height: 29px;
    width: 76px;
    border-radius: 5px;
    border: 1px solid var(--white);
    background-color: transparent;
    color: var(--white);
    transition: all 0.3s ease;
    &:hover {
      background-color: var(--white);
      color: var(--pink);
    }
  }
`;

export default CommentSection;
