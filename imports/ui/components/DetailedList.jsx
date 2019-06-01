/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Card,
  Button,
  Input,
} from 'semantic-ui-react';
import FaPencil from 'react-icons/lib/fa/pencil';
import { Tracker } from 'meteor/tracker';
import MdSave from 'react-icons/lib/md/save';

const ListTile = (props) => {
  const [isEditable, enableEditable] = useState(false);
  const [tempTitle, changeTempTitle] = useState('');
  const input = useRef();
  const [ownerName, changeOwnerName] = useState('');
  const [slideChangeDisable, changeSlideChangeDisable] = useState(false);

  const {
    userId,
    changeTitleOfItem,
    title,
    deleteItem,
    index,
    handleClick,
  } = props;

  const isOwner = Meteor.userId() === userId;

  useEffect(() => {
    Tracker.autorun(() => {
      Meteor.call('getUsername', userId, (err, username) => {
        changeOwnerName(username);
      });
    });
  });

  return (
    <Card
      onClick={() => {
        if (!slideChangeDisable) { handleClick(undefined, index); }
      }}
      style={{
        margin: '0', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between',
      }}
    >
      <Card.Content
        style={{ flex: 5 }}
      >
        {isEditable ? (
          <Input
            ref={input}
            onChange={(_e, d) => {
              changeTempTitle(d.value);
            }}
            value={tempTitle}
          />
        ) : <Card.Header style={{ width: '100%' }}>{title}</Card.Header>}
        <Card.Meta style={{ marginTop: '0.4rem' }}>{ownerName}</Card.Meta>
      </Card.Content>
      <Card.Content style={{
        flex: 1, display: 'flex', flexDirection: 'row', height: '4.8rem',
      }}
      >

        {isOwner ? (
          <Fragment>

            {isEditable ? (
              <Button
                icon
                onClick={() => {
                  enableEditable(false);
                  changeTitleOfItem(tempTitle, index);
                }}
              >
                <MdSave />
              </Button>
            ) : (
              <Button
                icon
                onClick={() => {
                  enableEditable(true);
                  changeTempTitle(props.title);
                }}
              >
                <FaPencil />
              </Button>
            )}

            <Button
              onMouseOver={() => {
                changeSlideChangeDisable(true);
              }}
              onMouseOut={() => {
                changeSlideChangeDisable(false);
              }}
              onClick={() => {
                if (confirm('Are you sure you want to delete?')) { deleteItem(props.index); }
              }}
              icon
            >
              X
            </Button>
          </Fragment>
        ) : null}

      </Card.Content>
    </Card>
  );
};

ListTile.propTypes = {
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  changeTitleOfItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  deleteItem: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};

const DetailedList = (props) => {
  const {
    items,
    deleteItem,
    changeTitleOfItem,
    handleClick,
  } = props;
  const renderSlides = () => items.map((item, index) => (
    <ListTile
      userId={item.userId}
      deleteItem={deleteItem}
      changeTitleOfSlide={changeTitleOfItem}
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      index={index}
      title={item.title}
      handleClick={handleClick}
    />
  ));
  return (<Menu vertical style={{ width: '100%' }}>{renderSlides()}</Menu>);
};

DetailedList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  changeTitleOfItem: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default DetailedList;