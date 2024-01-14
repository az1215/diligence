import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import personal_name from "../public/personal_name.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {},
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    border: "1px solid #000",
    // backgroundColor: "#101F33"
    padding: "20px",
    borderRadius: "7px",
    alignItems: "center",
    marginBottom: "5px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [empCodeMail, setEmpCodeMail] = useState("");
  const [passwd, setPasswd] = useState("");

  const [isErrEmpCodeMail, setIsErrEmpCodeMail] = useState(false);
  const [isErrPasswd, setIsErrPasswd] = useState(false);

  return (
    <>
      <Container maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <div>
            <img
              src={personal_name}
              style={{
                marginRight: "20px",
              }}
            />
          </div>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="社員コードまたはメールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              error={isErrEmpCodeMail}
              onBlur={(e) => {
                setEmpCodeMail(e.target.value);
                if (e.target.value.trim() === "") {
                  setIsErrEmpCodeMail(true);
                } else {
                  setIsErrEmpCodeMail(false);
                }
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              autoComplete="current-password"
              error={isErrPasswd}
              onBlur={(e) => {
                setPasswd(e.target.value);
                if (e.target.value.trim() === "") {
                  setIsErrPasswd(true);
                } else {
                  setIsErrPasswd(false);
                }
              }}
            />
            {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                navigate("/main");
              }}
            >
              ログイン
            </Button>
          </form>
        </div>
        <Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <Link href="#" variant="body2">
              パスワードを忘れた場合
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
