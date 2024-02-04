package com.jiraynor.boardback.repository;

import com.jiraynor.boardback.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Integer> {
}
