package proj.pet.notice.service;

import org.springframework.data.domain.PageRequest;
import proj.pet.member.dto.UserSessionDto;
import proj.pet.notice.dto.NoticeResponseDto;

public interface NoticeFacadeService {

	NoticeResponseDto getMyNotice(UserSessionDto userSessionDto, PageRequest pageRequest);
}