import appInit from "./server";

const port = process.env.PORT;

appInit().then((app) => {
  app.listen(port, () => {
    console.log(`Example app listeniung at http://localhost:${port}`);
  });
});
