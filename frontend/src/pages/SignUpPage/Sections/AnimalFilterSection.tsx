import { useState, useEffect } from "react";
import { styled } from "styled-components";
import { SectionProps } from "@/pages/SignUpPage/SignUpPage";
import { Section } from "@/pages/SignUpPage/SignUpPage";
import AnimalButtonContainer from "@/components/AnimalButtonContainer";
import RevertButton from "@/pages/SignUpPage/components/RevertButton";
import { AnimalSpecies } from "@/types/enum/animal.filter.enum";
import useToaster from "@/hooks/useToaster";

const AnimalFilterSection: React.FC<SectionProps> = ({
  registerData,
  setRegisterData,
  setStep,
}) => {
  const [isFading, setIsFading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<AnimalSpecies[]>([]);
  const { popToast } = useToaster();

  const handleOnClick = () => {
    if (categoryList.length === 0) {
      popToast("카테고리를 선택해주세요.", "N");
      return;
    }
    setRegisterData({ ...registerData, categoryFilters: [...categoryList] });
    setIsFading(true);
    setTimeout(() => {
      setStep(Section.Success);
    }, 200);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsFading(false);
    }, 200);
  }, []);

  return (
    <WrapperStyled $isFading={isFading}>
      <RevertButton
        setStep={setStep}
        to={Section.Introduction}
        setIsFading={setIsFading}
      />
      <h1>
        만나고 싶은 동물 친구들을 <br /> 선택해 주세요
      </h1>
      <ButtonZoneStyled>
        <AnimalButtonContainer
          columns={2}
          buttonRow={50}
          buttonFontSize={150}
          setter={setCategoryList}
        />
      </ButtonZoneStyled>
      <NextButtonStyled onClick={handleOnClick}>
        <img src="/assets/arrowW.png" />
      </NextButtonStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{ $isFading: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  opacity: ${({ $isFading }) => ($isFading ? 0 : 1)};
  transition: opacity 0.2s ease;
  h1 {
    font-size: 3rem;
    text-align: center;
  }
`;

const ButtonZoneStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NextButtonStyled = styled.button`
  z-index: 2;
  height: 45px;
  width: 45px;
  padding: 0;
  margin-left: 10px;
  margin-top: 20px;
  border: none;
  background-color: transparent;
  img {
    width: 100%;
    opacity: 0.5;
  }
  img:hover {
    opacity: 0.8;
    transition: opacity 0.5s ease;
  }
`;

export default AnimalFilterSection;
