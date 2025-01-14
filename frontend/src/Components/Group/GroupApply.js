import React, { useState } from 'react';
import './group.css';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import GroupMemberSearch from './GroupMemberSearch';
import AlertDialog from '../Other/AlertDialog';
import Snackbar from '../UI/Snackbar';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginBottom: {
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  chip: {
    marginBottom: '4px',
    marginRight: '4px',
  },
}));

const GroupApply = (props) => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(null);
  const [info, setInfo] = useState(props.info);
  console.log(props);
  return (
    <div className='dialog-wrap'>
      <DialogContent className={classes.content}>
        <div className={classes.marginBottom}>
          <div style={{ display: 'flex' }}>
            <img
              style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
              alt='group-master-img'
              src={info.admin.userPic}
            />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: '20px' }}>
              <div style={{ flex: 1, fontSize: '22px' }}>
                <span style={{ fontWeight: 'bold' }}>그룹장</span>
                <br />
                <span>{info.admin.userNm}</span>
              </div>
              <Button
                style={{ backgroundColor: '#eee' }}
                onClick={() =>
                  setDialog(
                    <Dialog open onClose={() => setDialog(null)}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '6px 8px',
                          maxHeight: '600px',
                        }}
                      >
                        {info.member.length > 0 ? (
                          info.member.map((value, index) => {
                            return (
                              <Button
                                key={`member-${index}`}
                                onClick={async () => {
                                  if (!window.confirm('그룹장을 정말 바꾸시겠습니까?')) {
                                    return;
                                  }
                                  console.log(info, value, info.groupCd, value.userCd);
                                  try {
                                    await axios.post('/group/changeMaster', {
                                      groupCd: info.groupCd,
                                      userCd: value.userCd,
                                    });
                                    window.location.href = '/main';
                                  } catch (error) {
                                    console.error(error);
                                    setDialog(
                                      <Snackbar onClose={() => setDialog(null)} severity='error' content={`${error}`} />
                                    );
                                  }
                                }}
                              >
                                <div
                                  style={{
                                    height: '60px',
                                    padding: '5px 2px',
                                    display: 'flex',
                                    borderBottom: '1px solid #eee',
                                  }}
                                >
                                  <img
                                    style={{
                                      height: '50px',
                                      width: '50px',
                                      objectFit: 'cover',
                                      borderRadius: '50%',
                                    }}
                                    src={value.userPic}
                                    alt='user img'
                                  />
                                  <div
                                    style={{
                                      flex: 1,
                                      paddingLeft: '18px',
                                      lineHeight: '50px',
                                      fontWeight: 'bold',
                                    }}
                                  >{`${value.userId}(${value.userNm})`}</div>
                                </div>
                              </Button>
                            );
                          })
                        ) : (
                          <span style={{ color: '#999' }}>그룹장을 양도할 그룹멤버가 없습니다.</span>
                        )}
                      </div>
                    </Dialog>
                  )
                }
              >
                <div style={{ flex: 1 }}>그룹장 변경</div>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>그룹멤버</span>
          <br />
          <div>
            {(() => {
              return info.member.map((value, index) => {
                return (
                  <Chip
                    avatar={<Avatar alt={`${value.userNm} img`} src={value.userPic} />}
                    key={`member-${value.userCd}`}
                    className={classes.chip}
                    label={value.userNm}
                    clickable
                    variant='outlined'
                    onDelete={() => {
                      setDialog(
                        <AlertDialog
                          severity='success'
                          content='정말로 강퇴하시겠습니까'
                          onAlertClose={() => setDialog(null)}
                          onAlertSubmit={async () => {
                            try {
                              const { data } = await axios.post('/groupMember/delete', {
                                userCd: value.userCd, 
                                groupCd: info.groupCd,
                              });
                              console.log(data);
                              if (!data) {
                                setDialog(
                                  <AlertDialog
                                    severity='error'
                                    content='그룹 멤버 삭제에 실패하였습니다'
                                    onAlertClose={() => setDialog(null)}
                                  />
                                );
                                return;
                              }

                              const k = JSON.parse(JSON.stringify(info.member));
                              k.splice(index, 1);
                              setInfo({
                                ...info,
                                member: k,
                              });
                              props.onChangeData({
                                ...info,
                                member: k,
                              });
                              setDialog(null);
                            } catch (error) {
                              setDialog(
                                <AlertDialog
                                  severity='error'
                                  content='서버 에러로 인해 그룹 멤버 삭제에 실패하였습니다'
                                  onAlertClose={() => setDialog(null)}
                                />
                              );
                            }
                          }}
                        />
                      );
                    }}
                  />
                );
              });
            })()}
            <Chip
              className={classes.chip}
              icon={<AddIcon />}
              label='ADD'
              clickable
              variant='outlined'
              onClick={() => {
                setDialog(
                  <GroupMemberSearch
                    onCancel={() => setDialog(false)}
                    info={info}
                    onAdd={(addUser) => {
                      setDialog(false);
                      setDialog(
                        <AlertDialog
                          onAlertClose={() => setDialog(null)}
                          severity='success'
                          content={`${addUser.userId}(${addUser.userNm})에게 초대 요청을 보냈습니다.`}
                        />
                      );
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      </DialogContent>
      {dialog}
    </div>
  );
};

export default GroupApply;
