
import { LoginService } from "./login.service"

function sum(a: number, b: number) {
  return a + b
}

describe('LoginService', () => {
  it('shoul sum values', () => {
    let a = 7;
    let b = 1;

    let result = sum(a, b);

    expect(result).toEqual(a + b)
  })
})

// describe('LoginService', () => {

//   it('Should sign in a user successfully', async () => {

//     const user = 'abc'
//     const password = '123'

//     const service = new LoginService();
//     const response = await service.loginUser(user, password);

//     console.log(response, "mostrando a response dentro do teste de login ")

//     expect(response).toBe(true);

//   })


// })
