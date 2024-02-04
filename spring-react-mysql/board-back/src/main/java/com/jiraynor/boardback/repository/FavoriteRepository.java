package com.jiraynor.boardback.repository;

import com.jiraynor.boardback.entity.FavoriteEntity;
import com.jiraynor.boardback.entity.primaryKey.FavoritePk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * JpaRepository 를 사용할 때, 단일 기본키를 사용하는 경우에는 엔티티 클래스의 기본키 타입을 지정하지만,
 * 복합 기본키를 사용하는 경우에는 별도의 클래스를 사용하여 그 클래스를 타입으로 지정해야 한다.
 */

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {
}
