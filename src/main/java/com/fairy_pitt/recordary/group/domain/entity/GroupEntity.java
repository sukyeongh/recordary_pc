package com.fairy_pitt.recordary.group.domain.entity;
import com.fairy_pitt.recordary.model.Users;
import lombok.*;
import javax.persistence.Id;
import javax.persistence.*;

@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "GROUP_TB")
@NoArgsConstructor
@AllArgsConstructor
public class GroupEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "GROUP_CD" )
    private Long groupCd;

    @ManyToOne(fetch = FetchType.LAZY) // ManyToOne 에서는 @Column 을 지원하지 않음
    @JoinColumn(name = "USER_CD")
    private Users gMstUserFK;

    @Column(name = "GROUP_NM")
    private String gName;

    @Column(name = "GROUP_PB_ST")
    private Boolean gState;

    @Column(name = "GROUP_PIC" )
    private String gPic;

    @Column(name = "GROUP_EX")
    private String  gEx;


}
