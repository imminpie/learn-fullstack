package com.jiraynor.boardback.service.implement;

import com.jiraynor.boardback.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class FileServiceImplement implements FileService {

    @Value("${file.path}")
    private String filePath;
    @Value("${file.url}")
    private String fileUrl;

    @Override
    public String upload(MultipartFile file) {
        if (file.isEmpty()) return null;

        // 업로드된 파일의 원본 파일명 가져오기
        String originalFileName = file.getOriginalFilename();

        // 파일명에서 확장자 추출
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

        String uuid = UUID.randomUUID().toString();

        // 최종적으로 저장될 파일명 생성
        String saveFileName = uuid + extension;

        // 파일이 저장될 전체 경로 생성
        String savePath = filePath + saveFileName;

        try {
            // 파일을 실제로 저장
            file.transferTo(new File(savePath));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        // 업로드된 파일의 URL 을 생성
        String url = fileUrl + saveFileName;
        return url;
    }

    @Override
    public Resource getImage(String fileName) {

        Resource resource = null;

        try {
            resource = new UrlResource("file:" + filePath + fileName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return resource;
    }
}
