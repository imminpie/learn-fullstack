package com.jiraynor.boardback.repository;

import com.jiraynor.boardback.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
}
