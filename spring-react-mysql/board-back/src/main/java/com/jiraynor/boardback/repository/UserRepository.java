package com.jiraynor.boardback.repository;

import com.jiraynor.boardback.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    /**
     * existsBy
     * JPA 에서 특정 데이터가 데이터베이스에 존재하는지를 여부를 검사한다.
     */
    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    boolean existsByTelNumber(String telNumber);

    UserEntity findByEmail(String email);
}
