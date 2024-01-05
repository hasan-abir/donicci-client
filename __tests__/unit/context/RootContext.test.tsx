/**
 * @format
 */

import React, {useContext, useEffect, useState} from 'react';
import 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react-native';
import {Text, View, Button} from 'react-native';
import RootContextProvider, {
  CartItem,
  ErrorType,
  RootContext,
  attemptRefreshToken
} from '../../../context/RootContext';
import type {
  LoginInput,
  RegisterInput,
} from '../../../controllers/userController';
import demoCartItems from '../../e2e/helpers/demoCartItems.json';
import demoProducts from '../../e2e/helpers/demoProducts.json';
import userController from '../../../controllers/userController';
import cartItemController from '../../../controllers/cartItemController';

jest.mock('../../../axios/instance');
jest.mock('../../../controllers/userController');
jest.mock('../../../controllers/cartItemController');

interface AuthenticateUserComponentProps {
  input: LoginInput | RegisterInput;
  screen: string;
}

const TestComponent = () => {
  const {user, error} = useContext(RootContext);

  return (
    <View>
      <Text>{user?.display_name}</Text>
      {error?.msgs.map((msg, index) => {
        return <Text key={index}>{msg}</Text>;
      })}
    </View>
  );
};

describe('RootContext', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('authenticateUser', () => {
    const AuthenticateUserComponent = ({
      input,
      screen,
    }: AuthenticateUserComponentProps) => {
      const {authenticateUser} = useContext(RootContext);
      const initialRequest = async () => {
        await authenticateUser(input, screen);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores user and token when login', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const user = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      const response = {
        access_token: '123',
        refresh_token: '456',
      };

      (userController.login as jest.Mock).mockResolvedValue(response);
      (userController.getCurrentUser as jest.Mock).mockResolvedValue(user);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.access_token,
      );
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.refresh_token,
      );

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(userController.login).toBeCalledWith(input);
        expect(userController.getCurrentUser).toBeCalledWith(
          response.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.refresh_token,
        );
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
    });

    it('stores user and token when register', async () => {
      const input = {
        display_name: 'Hasan Abir',
        username: 'hasan_abir1999',
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const response = {
        access_token: '123',
        refresh_token: '456',
      };
      const user = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.register as jest.Mock).mockResolvedValue(response);
      (userController.getCurrentUser as jest.Mock).mockResolvedValue(user);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.access_token,
      );
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        response.refresh_token,
      );

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Register" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(userController.register).toBeCalledWith(input);
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.refresh_token,
        );
        expect(userController.getCurrentUser).toBeCalledWith(
          response.access_token,
        );
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
    });

    it('stores error messages', async () => {
      const input = {
        email: 'hasan@test.com',
        password: 'testtest',
      };

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msgs: ['This is wrong', 'That is wrong']},
      };

      (userController.login as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <AuthenticateUserComponent input={input} screen="Login" />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(userController.login).toBeCalledWith(input);

        expect(
          screen.queryByText(error.response.data.msgs[0]),
        ).toBeOnTheScreen();
        expect(
          screen.queryByText(error.response.data.msgs[1]),
        ).toBeOnTheScreen();
      });
    });
  });
  describe('verifyCurrentUser', () => {
    const VerifyCurrentUserComponent = () => {
      const {verifyCurrentUser} = useContext(RootContext);
      const initialRequest = async () => {
        await verifyCurrentUser();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores user and token when verified', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      render(
        <RootContextProvider>
          <VerifyCurrentUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();
    });

    it("doesn't store user and token when there is an error", async () => {
      const access_token = '123';
      const refresh_token = '456';

      const err: any = new Error();
      err.response = {
        status: 400,
        data: {
          msg: 'Some msg',
        },
      };

      (userController.getCurrentUser as jest.Mock).mockRejectedValue(err);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      render(
        <RootContextProvider>
          <VerifyCurrentUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Some msg')).toBeOnTheScreen();
      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });

    it("doesn't store user and token when token is null", async () => {
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <VerifyCurrentUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(userController.getCurrentUser).toBeCalledTimes(0);
      });

      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });
  });

  describe('refreshToken', () => {
    const RefreshTokenComponent = () => {
      const initialRequest = async () => {
        await attemptRefreshToken();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('stores the token when valid token', async () => {
      const access_token = '768';
      const refresh_token = '768';
      const response = {
        access_token: '123',
        refresh_token: '456',
      };

      (userController.refreshToken as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      render(
        <RootContextProvider>
          <RefreshTokenComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
        expect(userController.refreshToken).toBeCalledWith(refresh_token);
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@user_token',
          response.access_token,
        );
        expect(AsyncStorage.setItem).toBeCalledWith(
          '@refresh_token',
          response.refresh_token,
        );
      });
    });
  });

  describe('logOutUser', () => {
    const LogOutUserComponent = () => {
      const {logOutUser} = useContext(RootContext);

      const initialRequest = async () => {
        await logOutUser();
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('logs out the user', async () => {
      const accessToken = '123';
      const refresh_token = '123';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(accessToken);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(refresh_token);
      (userController.logout as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <LogOutUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.logout).toBeCalledWith(accessToken);
        expect(AsyncStorage.removeItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.removeItem).toBeCalledWith('@refresh_token');
      });

      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });

    it("doesn't log out the user and display the error messages", async () => {
      const accessToken = '123';
      const refresh_token = '123';

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(accessToken);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(refresh_token);
      const err: any = new Error();
      err.response = {
        status: 400,
        data: {
          msg: 'Some msg',
        },
      };
      (userController.logout as jest.Mock).mockRejectedValue(err);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <LogOutUserComponent />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.logout).toBeCalledWith(accessToken);
        expect(AsyncStorage.removeItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.removeItem).toBeCalledWith('@refresh_token');
      });

      expect(screen.queryByText('Some msg')).toBeOnTheScreen();
      expect(screen.queryByText('Hasan Abir')).not.toBeOnTheScreen();
    });
  });

  describe('handlError', () => {
    const HandleErrorComponent = ({errorObj}: {errorObj: any}) => {
      const {handleError} = useContext(RootContext);

      const initialRequest = async () => {
        await handleError(errorObj, 'Some message', ErrorType.Fetch);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return <TestComponent />;
    };

    it('shows the error messages', async () => {
      const err: any = new Error();
      err.response = {
        status: 400,
        data: {
          msgs: ['Some msg', 'Other msg'],
        },
      };

      render(
        <RootContextProvider>
          <HandleErrorComponent errorObj={err} />
        </RootContextProvider>,
      );

      expect(screen.queryByText('Some msg')).toBeOnTheScreen();
      expect(screen.queryByText('Other msg')).toBeOnTheScreen();
    });

    it('shows a single error message', async () => {
      const err: any = new Error();
      err.response = {
        status: 400,
        data: {
          msg: 'Some msg',
        },
      };

      render(
        <RootContextProvider>
          <HandleErrorComponent errorObj={err} />
        </RootContextProvider>,
      );

      expect(screen.queryByText('Some msg')).toBeOnTheScreen();
    });

    it('shows the default error message', async () => {
      const err: any = new Error();
      err.response = {
        status: 500,
      };

      render(
        <RootContextProvider>
          <HandleErrorComponent errorObj={err} />
        </RootContextProvider>,
      );

      expect(
        screen.queryByText('Something went wrong, try refreshing'),
      ).toBeOnTheScreen();
    });
  });

  describe('clearError', () => {
    const ClearErrorComponent = ({errorType}: {errorType: ErrorType}) => {
      const {handleError, clearError} = useContext(RootContext);

      const initialRequest = async () => {
        const err: any = new Error();
        err.response = {
          status: 400,
          data: {
            msgs: ['Some msg', 'Other msg'],
          },
        };

        await handleError(err, 'Some message', ErrorType.Fetch);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Button
            onPress={() => clearError(errorType)}
            testID="button"
            title="Button"
          />
          <TestComponent />
        </View>
      );
    };

    it('clears the error messages', async () => {
      render(
        <RootContextProvider>
          <ClearErrorComponent errorType={ErrorType.Fetch} />
        </RootContextProvider>,
      );

      const button = screen.getByTestId('button');

      fireEvent.press(button);

      expect(screen.queryByText('Some msg')).not.toBeOnTheScreen();
      expect(screen.queryByText('Other msg')).not.toBeOnTheScreen();
    });

    it("doesn't clear the error messages with mismatch error types", async () => {
      render(
        <RootContextProvider>
          <ClearErrorComponent errorType={ErrorType.Form} />
        </RootContextProvider>,
      );

      const button = screen.getByTestId('button');

      fireEvent.press(button);

      expect(screen.queryByText('Some msg')).toBeOnTheScreen();
      expect(screen.queryByText('Other msg')).toBeOnTheScreen();
    });
  });

  describe('calculateTheTotals', () => {
    const CalculateTheTotalsComponent = ({
      cartItems,
    }: {
      cartItems: CartItem[];
    }) => {
      const {calculateTheTotals, cartSum} = useContext(RootContext);

      const initialRequest = async () => {
        calculateTheTotals(cartItems);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Text testID="total">{cartSum.total}</Text>
          <Text testID="tax">{cartSum.tax}</Text>
          <Text testID="sub-total">{cartSum.subTotal}</Text>
          <TestComponent />
        </View>
      );
    };

    it('calculates and displays the total correctly', async () => {
      const cartItems = [...demoCartItems.cartItems]

      render(
        <RootContextProvider>
          <CalculateTheTotalsComponent cartItems={cartItems} />
        </RootContextProvider>,
      );

      const expectedSubTotal = Math.round(cartItems.map(item => item.product_price * item.selected_quantity).reduce((a, b) => a + b, 0))

      const expectedTax = Math.round(expectedSubTotal * 0.05)
      const expectedTotal = Math.round(expectedSubTotal + expectedTax)

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      expect(subTotal).toHaveTextContent(expectedSubTotal.toString());
      expect(tax).toHaveTextContent(expectedTax.toString());
      expect(total).toHaveTextContent(expectedTotal.toString());
    });

    it('calculates and displays the total correctly with less items', async () => {
      const cartItems = [...demoCartItems.cartItems.slice(0, 2)]
      
      render(
        <RootContextProvider>
          <CalculateTheTotalsComponent
            cartItems={cartItems}
          />
        </RootContextProvider>,
      );

      const expectedSubTotal = Math.round(cartItems.map(item => item.product_price * item.selected_quantity).reduce((a, b) => a + b, 0))

      const expectedTax = Math.round(expectedSubTotal * 0.05)
      const expectedTotal = Math.round(expectedSubTotal + expectedTax)

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      expect(subTotal).toHaveTextContent(expectedSubTotal.toString());
      expect(tax).toHaveTextContent(expectedTax.toString());
      expect(total).toHaveTextContent(expectedTotal.toString());
    });
  });

  describe('addItemToCart', () => {
    const AddItemToCartComponent = ({
      authenticated,
    }: {
      authenticated: boolean;
    }) => {
      const {
        verifyCurrentUser,
        setCartItems,
        addItemToCart,
        cartSum,
        cartItems,
      } = useContext(RootContext);
      const initialRequest = async () => {
        if (authenticated) {
          await verifyCurrentUser();
        }

        setCartItems(demoCartItems.cartItems.slice(1, 3));
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Button
            onPress={() => addItemToCart(demoProducts.products[8], 4, 'Screen')}
            testID="button"
            title="Button"
          />
          <Text testID="total">{cartSum.total}</Text>
          <Text testID="tax">{cartSum.tax}</Text>
          <Text testID="sub-total">{cartSum.subTotal}</Text>
          {cartItems.map(item => {
            return (
              <Text testID="item" key={item._id}>
                {item.product_title}
              </Text>
            );
          })}
          <TestComponent />
        </View>
      );
    };

    it('adds product, calculates, and displays the total correctly', async () => {
      render(
        <RootContextProvider>
          <AddItemToCartComponent authenticated={false} />
        </RootContextProvider>,
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      });

      expect(subTotal).toHaveTextContent('40985');
      expect(tax).toHaveTextContent('2049');
      expect(total).toHaveTextContent('43034');
    });

    it('adds product, calculates, and displays the total correctly from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      (cartItemController.addCartItem as jest.Mock).mockResolvedValue(
        demoCartItems.cartItems[0],
      );

      render(
        <RootContextProvider>
          <AddItemToCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.addCartItem).toBeCalledWith(
          access_token,
          demoProducts.products[8]._id,
          4,
        );
      });

      expect(subTotal).toHaveTextContent('40985');
      expect(tax).toHaveTextContent('2049');
      expect(total).toHaveTextContent('43034');
    });

    it('displays error from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msg: 'This is wrong'},
      };

      (cartItemController.addCartItem as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <AddItemToCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.addCartItem).toBeCalledWith(
          access_token,
          demoProducts.products[8]._id,
          4,
        );
      });

      expect(screen.queryByText('This is wrong')).toBeOnTheScreen();
    });
  });

  describe('removeItemFromCart', () => {
    const RemoveItemFromCartComponent = ({
      authenticated,
    }: {
      authenticated: boolean;
    }) => {
      const {
        verifyCurrentUser,
        setCartItems,
        removeItemFromCart,
        cartSum,
        cartItems,
      } = useContext(RootContext);
      const initialRequest = async () => {
        if (authenticated) {
          await verifyCurrentUser();
        }

        setCartItems(demoCartItems.cartItems.slice(0, 2));
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Button
            onPress={() =>
              removeItemFromCart(demoProducts.products[8]._id, 'Screen')
            }
            testID="button"
            title="Button"
          />
          <Text testID="total">{cartSum.total}</Text>
          <Text testID="tax">{cartSum.tax}</Text>
          <Text testID="sub-total">{cartSum.subTotal}</Text>
          {cartItems.map(item => {
            return (
              <Text testID="item" key={item._id}>
                {item.product_title}
              </Text>
            );
          })}
          <TestComponent />
        </View>
      );
    };

    it('removes product, calculates, and displays the total correctly', async () => {
      render(
        <RootContextProvider>
          <RemoveItemFromCartComponent authenticated={false} />
        </RootContextProvider>,
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');
      });

      expect(subTotal).toHaveTextContent('8997');
      expect(tax).toHaveTextContent('5');
      expect(total).toHaveTextContent('9447');
    });

    it('removes product, calculates, and displays the total correctly from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      (cartItemController.removeCartItem as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <RemoveItemFromCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.removeCartItem).toBeCalledWith(
          access_token,
          demoCartItems.cartItems[0]._id,
        );
      });

      expect(subTotal).toHaveTextContent('8997');
      expect(tax).toHaveTextContent('5');
      expect(total).toHaveTextContent('9447');
    });

    it('displays error from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msg: 'This is wrong'},
      };

      (cartItemController.removeCartItem as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <RemoveItemFromCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.removeCartItem).toBeCalledWith(
          access_token,
          demoCartItems.cartItems[0]._id,
        );
      });

      expect(screen.queryByText('This is wrong')).toBeOnTheScreen();
    });
  });

  describe('updateSelectedQuantity', () => {
    const UpdateSelectedQuantityComponent = ({add}: {add: boolean}) => {
      const {setCartItems, updateSelectedQuantity, cartSum, cartItems} =
        useContext(RootContext);
      const initialRequest = async () => {
        setCartItems(demoCartItems.cartItems.slice(0, 2));
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Button
            onPress={() =>
              updateSelectedQuantity(demoCartItems.cartItems[0]._id, add)
            }
            testID="button"
            title="Button"
          />
          <Text testID="total">{cartSum.total}</Text>
          <Text testID="tax">{cartSum.tax}</Text>
          <Text testID="sub-total">{cartSum.subTotal}</Text>
          {cartItems.map(item => {
            return (
              <Text testID="item" key={item._id}>
                {item.product_title}
              </Text>
            );
          })}
          <TestComponent />
        </View>
      );
    };

    it('adds quantity and calculates the totals properly', async () => {
      render(
        <RootContextProvider>
          <UpdateSelectedQuantityComponent add={true} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      expect(subTotal).toHaveTextContent('18992');
      expect(tax).toHaveTextContent('950');
      expect(total).toHaveTextContent('19942');
    });

    it('removes quantity and calculates the totals properly', async () => {
      render(
        <RootContextProvider>
          <UpdateSelectedQuantityComponent add={false} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      const button = screen.getByTestId('button');
      fireEvent.press(button);
      fireEvent.press(button);

      expect(subTotal).toHaveTextContent('14994');
      expect(tax).toHaveTextContent('750');
      expect(total).toHaveTextContent('15744');
    });
  });

  describe('clearCart', () => {
    const ClearCartComponent = ({authenticated}: {authenticated: boolean}) => {
      const {setCartItems, clearCart, cartSum, cartItems, verifyCurrentUser} =
        useContext(RootContext);
      const initialRequest = async () => {
        setCartItems(demoCartItems.cartItems.slice(0, 2));

        if (authenticated) {
          await verifyCurrentUser();
        }
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          <Button
            onPress={() => clearCart('Screen')}
            testID="button"
            title="Button"
          />
          <Text testID="total">{cartSum.total}</Text>
          <Text testID="tax">{cartSum.tax}</Text>
          <Text testID="sub-total">{cartSum.subTotal}</Text>
          {cartItems.map(item => {
            return (
              <Text testID="item" key={item._id}>
                {item.product_title}
              </Text>
            );
          })}
          <TestComponent />
        </View>
      );
    };

    it('clears cart and calculates the totals properly', async () => {
      render(
        <RootContextProvider>
          <ClearCartComponent authenticated={false} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      expect(subTotal).toHaveTextContent('0');
      expect(tax).toHaveTextContent('0');
      expect(total).toHaveTextContent('0');
    });

    it('clears cart and calculates the totals properly from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      (cartItemController.removeAllCartItems as jest.Mock).mockResolvedValue(
        null,
      );

      render(
        <RootContextProvider>
          <ClearCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.removeAllCartItems).toBeCalledWith(
          access_token,
        );
      });

      expect(subTotal).toHaveTextContent('0');
      expect(tax).toHaveTextContent('0');
      expect(total).toHaveTextContent('0');
    });

    it('displays error from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msg: 'This is wrong'},
      };

      (cartItemController.removeAllCartItems as jest.Mock).mockRejectedValue(
        error,
      );

      render(
        <RootContextProvider>
          <ClearCartComponent authenticated={true} />
        </RootContextProvider>,
      );

      const subTotal = screen.getByTestId('sub-total');
      const tax = screen.getByTestId('tax');
      const total = screen.getByTestId('total');

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.removeAllCartItems).toBeCalledWith(
          access_token,
        );
      });

      expect(screen.queryByText('This is wrong')).toBeOnTheScreen();
    });
  });

  describe('inCart', () => {
    const InCartComponent = ({
      authenticated,
      productId,
    }: {
      authenticated: boolean;
      productId: string;
    }) => {
      const [itemInCart, setItemInCart] = useState<boolean>(false);
      const {setCartItems, inCart, verifyCurrentUser} = useContext(RootContext);
      const initialRequest = async () => {
        if (authenticated) {
          await verifyCurrentUser();
        }

        setCartItems(demoCartItems.cartItems.slice(0, 2));
      };

      const onPress = async () => {
        const res = await inCart(productId);
        setItemInCart(res);
      };

      useEffect(() => {
        initialRequest();
      }, []);
      return (
        <View>
          {itemInCart ? <Text testID="in-cart">In Cart</Text> : null}
          <Button testID="button" onPress={onPress} title="button" />
          <TestComponent />
        </View>
      );
    };

    it('shows inCart text properly', async () => {
      render(
        <RootContextProvider>
          <InCartComponent
            authenticated={false}
            productId={demoProducts.products[8]._id}
          />
        </RootContextProvider>,
      );

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      const inCartText = screen.queryByTestId('in-cart');

      expect(inCartText).toBeOnTheScreen();
    });

    it("doesn't show inCart text properly", async () => {
      render(
        <RootContextProvider>
          <InCartComponent
            authenticated={false}
            productId={demoProducts.products[0]._id}
          />
        </RootContextProvider>,
      );

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      const inCartText = screen.queryByTestId('in-cart');

      expect(inCartText).not.toBeOnTheScreen();
    });

    it('shows inCart text properly from api', async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      (cartItemController.isInCart as jest.Mock).mockResolvedValue(null);

      render(
        <RootContextProvider>
          <InCartComponent
            authenticated={true}
            productId={demoProducts.products[8]._id}
          />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.isInCart).toBeCalledWith(
          access_token,
          demoProducts.products[8]._id,
        );
      });

      const inCartText = screen.queryByTestId('in-cart');

      expect(inCartText).toBeOnTheScreen();
    });

    it("doesn't show inCart text properly from api", async () => {
      const access_token = '123';
      const refresh_token = '456';
      const response = {
        username: 'hasan_abir1999',
        display_name: 'Hasan Abir',
      };

      (userController.getCurrentUser as jest.Mock).mockResolvedValue(response);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const error: any = new Error();

      error.response = {
        status: 400,
        data: {msg: 'This is wrong'},
      };

      (cartItemController.isInCart as jest.Mock).mockRejectedValue(error);

      render(
        <RootContextProvider>
          <InCartComponent
            authenticated={true}
            productId={demoProducts.products[0]._id}
          />
        </RootContextProvider>,
      );

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(userController.getCurrentUser).toBeCalledWith(access_token);
      });

      expect(screen.queryByText('Hasan Abir')).toBeOnTheScreen();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(access_token);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(refresh_token);

      const button = screen.getByTestId('button');
      await act(() => {
        fireEvent.press(button);
      });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toBeCalledWith('@user_token');
        expect(AsyncStorage.getItem).toBeCalledWith('@refresh_token');

        expect(cartItemController.isInCart).toBeCalledWith(
          access_token,
          demoProducts.products[0]._id,
        );
      });

      const inCartText = screen.queryByTestId('in-cart');

      expect(inCartText).not.toBeOnTheScreen();
    });
  });
});
