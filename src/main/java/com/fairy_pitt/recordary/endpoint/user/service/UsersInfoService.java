package com.fairy_pitt.recordary.endpoint.user.service;

import com.fairy_pitt.recordary.common.entity.Users;
import com.fairy_pitt.recordary.common.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersInfoService {
    @Autowired private UsersRepository usersRepository;
    @Autowired private UserPasswordHashService userPasswordHashService;

    public void update(Long userCd, String userNm, String userPw, String userEx) {
        Users user = usersRepository.findByUserCd(userCd);

        if (user == null) return;

        user.setUserNm(userNm);
        user.setUserPw(userPasswordHashService.getSHA256(userPw));
        user.setUserEx(userEx);
        usersRepository.save(user);
    }

    public void delete(Users user) {
//        if (user == null) return;
        usersRepository.delete(user);
    }

    public Users search(String userSearch){
        Users user = usersRepository.findByUserNm(userSearch);
        return user;
    }
}