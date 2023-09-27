import { register, login, logout } from '../utils/authFunctions';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

//A test to see if Jest is working properly... 
test('initial test...', () => {
    expect(1).toBe(1);
  });
  

//Jest Mocks: These will mock external funtions, basically Jest will return these mocks rather than the actual modules.
jest.mock('../firebase', () => ({
  auth: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn()
}));


//Jest Test Cases
describe('register function', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  

  //Identifier: User-Create-Account-Success
  //TestCase: A user is successfully able to register an account with the service
  test('user is successfully able to register an account with the service', async () => {  
    const mockUser = { user: { uid: 'some-uid' } };
    createUserWithEmailAndPassword.mockResolvedValueOnce(mockUser); 

    const email = 'test@success.com';
    const password = '123456';
    const result = await register(email, password, 'Mr. Test');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });
  

  //Identifier: User-Create-Account-Failure-General-Error
  //TestCase: A user is unable to create an account due to an internal Firebase Error that is unknown
  test('user is unable to create an account because there is an error from Firebase', async () => {
    const mockError = new Error('Error');
    createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);
    const email = 'error@test.com';
    const password = '123456';
    await expect(register(email, password, 'Mr. Test')).rejects.toEqual(mockError);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });

  //Identifier: User-Create-Account-Failure-Existing
  //TestCase: A user is unable to create an account because an account with that username already exists.
  test('user is unable to create an account because an account with that username already exists', async () => {
    const mockError = { code: 'auth/email-already-in-use', message: 'The email address is already in use by another account.' }; // This is the Firebase error that is thrown, seen in the console logs.
    createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

    const email = 'test@created.com';
    const password = '123456';

    await expect(register(email, password, 'Mr. Test')).rejects.toEqual(mockError);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });
});
  
  