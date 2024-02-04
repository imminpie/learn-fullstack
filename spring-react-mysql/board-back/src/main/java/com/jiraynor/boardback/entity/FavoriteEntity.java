package com.jiraynor.boardback.entity;

import com.jiraynor.boardback.entity.primaryKey.FavoritePk;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "favorite")
@Table(name = "favorite")
@IdClass(FavoritePk.class)
public class FavoriteEntity {

    /**
     * JPA 에서 복합 기본 키를 사용하는 경우, 별도의 복합 기본키 클래스를 만들고,
     * 이 복합 기본키 클래스를 엔티티에서 @IdClass 어노테이션을 사용하여 지정한다.
     */

    @Id
    private String userEmail;

    @Id
    private int boardNumber;

}
