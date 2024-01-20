import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Stack from "@mui/material/Stack";

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
    borderRadius: "7px",
    alignItems: "center",
    marginBottom: "5px",
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
      <body
        style={{ height: "100vh", backgroundColor: "#eaeff1", display: "flex" }}
      >
        <Container
          maxWidth="sm"
          style={{ alignItems: "center", display: "flex" }}
        >
          <Card style={{ alignItems: "center", marginBottom: "50px" }}>
            <CardContent style={{ padding: "20px" }}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={4}>
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      pl: { md: "0" },
                      pr: { md: "20px" },
                    }}
                  >
                    <img src={personal_name} />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container justifyContent="flex-end">
                        <Link href="#" variant="body2">
                          パスワードを忘れた場合
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </body>
    </>
  );
}
