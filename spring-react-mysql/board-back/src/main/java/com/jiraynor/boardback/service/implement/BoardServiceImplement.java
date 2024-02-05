package com.jiraynor.boardback.service.implement;

import com.jiraynor.boardback.dto.request.board.PostBoardRequestDto;
import com.jiraynor.boardback.dto.response.ResponseDto;
import com.jiraynor.boardback.dto.response.board.PostBoardResponseDto;
import com.jiraynor.boardback.entity.BoardEntity;
import com.jiraynor.boardback.entity.ImageEntity;
import com.jiraynor.boardback.repository.BoardRepository;
import com.jiraynor.boardback.repository.ImageRepository;
import com.jiraynor.boardback.repository.UserRepository;
import com.jiraynor.boardback.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;

    @Override
    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {
        try {
            // 사용자 이메일이 존재하는지 확인
            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostBoardResponseDto.notExistUser();

            // 게시글 엔티티 생성 및 저장
            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);

            int boardNumber = boardEntity.getBoardNumber();

            // 게시글에 속하는 이미지 엔티티 생성 및 저장
            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image : boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);
                imageEntities.add(imageEntity);
            }
            imageRepository.saveAll(imageEntities);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PostBoardResponseDto.success();
    }
}
