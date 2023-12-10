import React from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import styles from "./index.module.scss";

import { useWallet } from "@solana/wallet-adapter-react";
import { useDispatch } from "react-redux";
import { closeBurnNFTModal, burnNFTSuccess  } from "state/burnNFT/actions";


import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Field, Form } from 'react-final-form';
import { countries } from '../../constants/countries';

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "black",
    width: "60%",
    maxWidth: "700px",
    height: "70%",
    maxHeight: "600px",
    borderRadius: "16px",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
};



const useStyles = makeStyles((theme) => ({
  burnButton: {
    marginTop: '10px',
    width: '300px',
    height: '50px !important',
    borderRadius: '16px',
    backgroundColor: '#a93bc0',
    '&:hover': {
      backgroundColor: '#a93bc0',
      opacity: 0.9,
      transform: 'scale(1.05)',
    },
  },
  burnButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Exo',
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '150%'
  },
  buttons: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: `20px !important`,
  },
  fieldError: {
    borderColor: 'red',
  },
  fieldInputContainer: {
    fontFamily: "Exo",
    display: 'flex',
    flexDirection: 'column !important',
    width: '70%',
    color: 'white'
  },
  fieldContainer: {
    marginTop: 20,
  },
  errorText: {
    fontFamily: "Exo",
    fontSize: 13,
    fontWeight: '500',
    color: '#a93bc0',
    maxHeight: '20px'
  },
  countrySelect: {
    width: '100%',
  },
  countryFlag: {
    width: 40,
    marginRight: 10,
  },
  countryInput: {
    fontFamily: "Exo",
    fontSize: 13,
    fontWeight: '500',
    color: '#a93bc0',
  },
  burnSlogan: {
    fontFamily: "Exo",
    fontWeight: 600,
    color: '#a93bc0',
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
}));

const required = (value) => (value ? undefined : 'Required');
const mustBeNumber = (value) => (isNaN(value) ? 'Must be a number' : undefined);
const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const CountrySelect = ({ input, meta }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Select
        labelId="burn-country-select-label"
        className={styles['burn-country-select']}
        value={input.value}
        onChange={input.onChange}
        name="country"
      >
        {countries.map((option) => (
          <MenuItem value={option.label} key={option.label}>
            <img
              className={classes.countryFlag}
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt={option.code}
            />
            <div className={classes.countryInput} >{option.label} ({option.code}) +{option.phone}</div>
          </MenuItem>
        ))}
      </Select>
      {meta.error && meta.touched && <span className={classes.errorText}>{meta.error}</span>}
    </React.Fragment>
  );
};
const BurnForm = (props) => {
  let formData = {
    name: '',
    phone: '',
    address: '',
    postalCode: '',
    country: '',
  };

  const handleSubmit = props.handleSubmit;
  const submiting = false;
  const classes = useStyles();

  return (
    <div className={styles.wrapper}>
      <Typography className={classes.burnSlogan}>
        Enter your postal address and receive the coin at your doorstep for free!
      </Typography>
      <Form
        onSubmit={handleSubmit}
        initialValues={{
          ...formData,
        }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field name="name" validate={required}>
              {({ input, meta }) => (
                <div className={classes.fieldContainer}>
                  <label >Name</label>
                  <div className={classes.fieldInputContainer}>
                    <input className={classes.field} {...input} type="text" placeholder="Name"/>
                    {meta.error && meta.touched && <span className={classes.errorText}>{meta.error}</span>}
                  </div>
                </div>
              )}
            </Field>

            <Field name="phone" validate={composeValidators(required, mustBeNumber)}>
              {({ input, meta }) => (
                <div className={classes.fieldContainer}>
                  <label>Phone Number</label>
                  <div className={classes.fieldInputContainer}>
                    <input {...input} type="text" placeholder="Phone Number" />
                    {meta.error && meta.touched && <span className={classes.errorText}>{meta.error}</span>}
                  </div>
                </div>
              )}
            </Field>

            <Field name="address" validate={required}>
              {({ input, meta }) => (
                <div className={classes.fieldContainer}>
                  <label>Street & Number</label>
                  <div className={classes.fieldInputContainer}>
                    <input {...input} type="text" placeholder="Street & Number" />
                    {meta.error && meta.touched && <span className={classes.errorText}>{meta.error}</span>}
                  </div>
                </div>
              )}
            </Field>
            <Field name="postalCode" validate={required}>
              {({ input, meta }) => (
                <div className={classes.fieldContainer}>
                  <label>Postal Code - City & State (If applicable)</label>
                  <div className={classes.fieldInputContainer}>
                    <input {...input} type="text" placeholder="Postal Code - City & State" />
                    {meta.error && meta.touched && <span className={classes.errorText}>{meta.error}</span>}
                  </div>
                </div>
              )}
            </Field>

            <div className={classes.fieldContainer}>
              <label>Country</label>
              <div className={classes.fieldInputContainer}>
                <Field name="country" validate={required} component={CountrySelect} />
              </div>
            </div>
            <div className={classes.buttons}>
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={submitting || pristine}
                className={classes.burnButton}
              >
                {submiting ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="h4" className={classes.burnButtonText}>
                    Submit
                  </Typography>
                )}
              </Button>
              <Button type="button" onClick={form.reset} disabled={submitting || pristine}>
                Reset
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
};


const BurnNFTModal = (props) => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.burnNFT);
  const { isOpenModal } = modalData;

  return (
    <Modal
      isOpen={isOpenModal}
      style={modalStyle}
      contentLabel="Burn NFT Modal"
      onRequestClose={() => dispatch(closeBurnNFTModal())}
    >
          <div className={styles.connectWalletContainer}>
      <BurnForm 
        handleSubmit={()=> {dispatch(burnNFTSuccess())}}
      />
    </div>
    </Modal>
  );
};




export default BurnNFTModal;
