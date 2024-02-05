package com.jiraynor.boardback.entity;

import com.jiraynor.boardback.dto.request.board.PostBoardRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board")
@Table(name = "board")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardNumber;

    @Column
    private String title;

    @Column
    private String content;

    @Column
    private String writeDatetime;

    @Column
    private int favoriteCount;

    @Column
    private int commentCount;

    @Column
    private int viewCount;

    @Column
    private String writerEmail;

    // DTO → Entity
    public BoardEntity(PostBoardRequestDto dto, String email) {

        // 현재 시간을 가져와서 지정된 형식으로 저장한다.
        Date now = Date.from(Instant.now());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String writeDatetime = simpleDateFormat.format(now);

        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.writeDatetime = writeDatetime;
        this.favoriteCount = 0;
        this.commentCount = 0;
        this.viewCount = 0;
        this.writerEmail = email;
    }
}
