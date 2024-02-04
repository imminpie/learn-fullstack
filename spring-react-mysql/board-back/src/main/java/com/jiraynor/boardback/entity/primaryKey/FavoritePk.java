package com.jiraynor.boardback.entity.primaryKey;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable {

    /**
     * 복합 기본키 클래스
     * 복합 기본키 클래스는 Serializable 인터페이스를 구현해야 한다.
     */

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "board_number")
    private int boardNumber;

}
