import React, { useState } from 'react';
import 'Components/Profile/PostAppend.css';
import SelectGroup from 'Components/UI/SelectGroup';
import PublicRange from 'Components/UI/PublicRange';
import Backdrop from 'Components/UI/Backdrop';
import AlertDialog from 'Components/Other/AlertDialog';
import Snackbar from 'Components/UI/Snackbar';
import Calendar from 'Components/Calendar/Calendar';

import PostAddIcon from '@material-ui/icons/PostAdd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import axios from 'axios';
import store from 'store';

const ScheduleShare = props => {
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(null);

  const [userPost, setUserPost] = useState({
    user_id: store.getState().user.currentUser.user_id,
    // group_cd: store.getState().user.userGroup[0].group_cd,
    group_cd: null,
    inputPost: {
      post_ex: null,
      post_pb_st: null,
      post_str_ymd: null,
      post_end_ymd: null
    }
  });

  const showCalendar = () => {
    if (calendarOpen === null) {
      setCalendarOpen(
        <Dialog
          onClose={() => setCalendarOpen(null)}
          open
          style={{ backgroundColor: 'rgba(241, 242, 246,0.1)' }}
        >
          <div className='post-append-header'>
            <div className='Post-Append-titleName'>
              <PostAddIcon
                style={{ fontSize: '40px', color: 'white', marginLeft: '10px' }}
              />
              <div className='PostAdd-title'>내 일정 공유</div>
            </div>
          </div>
          <div style={{ margin: '20px' }}>
            <Calendar />
          </div>
        </Dialog>
      );
      return;
    }
    setCalendarOpen(null);
    return;
  };

  const changeHandle = e => {
    setUserPost({
      ...userPost,
      inputPost: { ...userPost.inputPost, [e.target.name]: e.target.value }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    setAlert(<Backdrop />);

    try {
      console.log(userPost);

      const form = new FormData();
      form.append('user_id', userPost.user_id);
      form.append('group_cd', userPost.group_cd);
      form.append('inputPost', userPost.inputPost);

      const { data } = await axios.post('/post/write', form);

      console.log(data);

      if (data.isWrite) {
        setAlert(
          <AlertDialog
            severity='success'
            content='게시물이 추가되었습니다.'
            onAlertClose={() => setAlert(null)}
          />
        );
      } else {
        setAlert(
          <Snackbar
            severity='error'
            content='게시물을 추가하지 못했습니다.'
            onClose={() => setAlert(null)}
          />
        );
      }
    } catch (error) {
      console.log(error);
      setAlert(
        <Snackbar
          severity='error'
          content='서버 에러로 게시물을 추가하지 못했습니다..'
          onClose={() => setAlert(null)}
        />
      );
    }
  };

  return (
    <Dialog open style={{ backgroundColor: 'rgba(241, 242, 246,0.1)' }}>
      <div className='post-append-header' style={{ width: '600px' }}>
        <div className='Post-Append-titleName'>
          <PostAddIcon
            style={{ fontSize: '40px', color: 'white', marginLeft: '10px' }}
          />
          <div className='PostAdd-title'>내 일정 공유</div>
        </div>
      </div>
      <div className='Post-Media-Schedule-Append-Form '>
        <div className='Post-Append-Group' style={{ marginLeft: '12px' }}>
          <div>
            <SelectGroup />
          </div>
          <div className='schedule-media-button '>
            <div className='plus-button-design' onClick={showCalendar}>
              <div className='plus-button-design-2'>
                <EventAvailableIcon style={{ fontSize: '30px' }} />
                <span style={{ fontSize: '15px', marginLeft: '5px' }}>
                  일정찾기
                </span>
              </div>
            </div>
            <PublicRange />
          </div>
        </div>
        {calendarOpen}

        <div className='Post-Append-Bottom'>
          <div className='Post-Upload-buttons'>
            <Button onClick={handleClickOpen}>게시</Button>
            <Button onClick={() => props.onCancel()}>취소</Button>
          </div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'> {'내 일정 공유'}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                게시물을 공유하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(handleClose, () => props.onCancel(), onSubmit)}
                color='primary'
              >
                확인
              </Button>
              <Button onClick={handleClose} color='primary' autoFocus>
                취소
              </Button>
            </DialogActions>
            {{ alert }}
          </Dialog>
        </div>
      </div>
    </Dialog>
  );
};

export default ScheduleShare;