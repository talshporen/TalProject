const appInit =require('./server');
const port = process.env.PORT;

const tmpFunk = async () => {
  const app = await appInit();
  app.listen(port, () => {
    console.log(`Example app listeniung at http://localhost:${port}`);
  });
};
tmpFunk();