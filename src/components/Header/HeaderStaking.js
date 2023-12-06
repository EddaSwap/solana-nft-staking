/*eslint-disable*/
import React from "react";
import { useSelector, useDispatch } from "react-redux";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons

// core components

import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import amountImg from "assets/img/amount.svg";


import { isMobile } from "react-device-detect";
import Mint from "views/Mint/index.js";
const useStyles = makeStyles(styles);

function HeaderLinks (props) {
  const classes = useStyles();
  const { userPoints} = useSelector(state=>state.points);
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          href="https://madtrooper.com"
          color="transparent"
          className={classes.navLink}
          onClick={props.onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          Home
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/"
          color="transparent"
          className={classes.navLink}
        >
          Stake
        </Button>
      </ListItem>
      
      {!isMobile && (
        <>
        <ListItem className={classes.listItem}>
        <Button
          href="/reward"
          color="transparent"
          className={classes.navLink}
        >
          Rewards
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/leaderboard"
          color="transparent"
          className={classes.navLink}
        >
          Leaderboard
        </Button>
      </ListItem>
        <ListItem className={classes.listItem}>
        <a
          className={classes.amount}
          href="/reward"
        >
          <img
            src={amountImg}
            style={{ width: "17px", height: "17px", marginRight: "10px" }}
          />
          {userPoints ? userPoints : "0.00"}
        </a>
      </ListItem>
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "center",
              padding: "0px",
              "&:hover": {
                backgroundColor: "none",
              },
            }}
          >
            <Mint />
          </Button>
        </ListItem>
        </>
      )
      }
    </List>
  );
}


export default HeaderLinks;
