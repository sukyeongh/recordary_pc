package com.fairy_pitt.recordary.endpoint.media;

import com.fairy_pitt.recordary.endpoint.main.S3UploadComponent;
import com.fairy_pitt.recordary.endpoint.media.service.MediaService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("media")
public class MediaController {

    private final S3UploadComponent s3UploadComponent;
    private final MediaService mediaService;

    @PostMapping("/{userCd}")
    public Long upload(@PathVariable Long userCd, @RequestParam MultipartFile[] mediaFiles) throws IOException {
        return  mediaService.save(mediaFiles, userCd);
    }

    @GetMapping("/{mediaCd}}")
    public List<String> getMediaPath(@PathVariable Long mediaCd){
        return mediaService.getMediaPath(mediaCd);
    }
}

