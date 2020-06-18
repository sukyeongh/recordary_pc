package com.fairy_pitt.recordary.endpoint.post.service;

import com.fairy_pitt.recordary.common.domain.PostEntity;
import com.fairy_pitt.recordary.common.domain.PostLikeEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.repository.PostLikeRepository;
import com.fairy_pitt.recordary.endpoint.post.dto.PostResponseDto;
import com.fairy_pitt.recordary.endpoint.user.dto.UserResponseDto;
import com.fairy_pitt.recordary.endpoint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Service
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostService postService;
    private final UserService userService;

    @Transactional
    public Boolean save(Long postCd, Long userCd){
        PostLikeEntity postLikeEntity = PostLikeEntity.builder()
                .postFK(postService.findEntity(postCd))
                .userFK(userService.findEntity(userCd))
                .build();

        return Optional.ofNullable(postLikeRepository.save(postLikeEntity)).isPresent();
    }

    @Transactional
    public Boolean delete(Long postCd, Long userCd){
        PostLikeEntity postLikeEntity = Optional.ofNullable(
                postLikeRepository.findByPostFKAndUserFK(postService.findEntity(postCd), userService.findEntity(userCd)))
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물에 좋아요를 하지 않았습니다. code = " + postCd));
        postLikeRepository.delete(postLikeEntity);
        return !Optional.ofNullable(this.findEntity(postCd, userCd)).isPresent();
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> postLikeUser(Long postCd){
        PostEntity postEntity = postService.findEntity(postCd);
        List<UserEntity> userEntityList = new ArrayList<>();
        for (PostLikeEntity postLikeEntity : postLikeRepository.findAllByPostFK(postEntity)){
            userEntityList.add(postLikeEntity.getUserFK());
        }
        return userEntityList.stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponseDto> userLikePost(Long userCd){
        UserEntity userEntity = userService.findEntity(userCd);
        List<PostEntity> postEntityList = new ArrayList<>();;
        for (PostLikeEntity postLikeEntity : postLikeRepository.findAllByUserFK(userEntity)){
            postEntityList.add(postLikeEntity.getPostFK());
        }
        System.out.println("================");
        return postEntityList.stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostLikeEntity findEntity(Long postCd, Long userCd){
        PostEntity postEntity = postService.findEntity(postCd);
        UserEntity userEntity = userService.findEntity(userCd);
        return postLikeRepository.findByPostFKAndUserFK(postEntity, userEntity);
    }
}
