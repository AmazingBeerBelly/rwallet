/** Actions related to Wallet functions */

const actions = {
  // Constants definition
  SET_WALLET_MANAGER: 'SET_WALLET_MANAGER',

  GET_PRICE: 'GET_PRICE',
  GET_PRICE_RESULT: 'GET_PRICE_RESULT',

  FETCH_BALANCE: 'FETCH_BALANCE',
  FETCH_BALANCE_RESULT: 'FETCH_BALANCE_RESULT',
  RESET_BALANCE_UPDATED: 'RESET_BALANCE_UPDATED',

  FETCH_TRANSACTION: 'FETCH_TRANSACTION',
  FETCH_TRANSACTION_RESULT: 'FETCH_TRANSACTION_RESULT',

  DELETE_KEY: 'DELETE_KEY',
  RENAME_KEY: 'RENAME_KEY',
  CREATE_KEY: 'CREATE_KEY',

  UPDATE_ASSET_VALUE: 'UPDATE_ASSET_VALUE',
  WALLETS_UPDATED: 'WALLETS_UPDATED',

  START_FETCH_PRICE_TIMER: 'START_FETCH_PRICE_TIMER',
  START_FETCH_BALANCE_TIMER: 'START_FETCH_BALANCE_TIMER',
  START_FETCH_TRANSACTION_TIMER: 'START_FETCH_TRANSACTION_TIMER',

  // Functions definition
  getPrice: (symbols, currencies) => ({
    type: actions.GET_PRICE,
    payload: {
      symbols,
      currencies,
    },
  }),
  fetchBalance: (walletManager) => ({
    type: actions.FETCH_BALANCE,
    payload: walletManager,
  }),
  resetBalanceUpdated: () => ({
    type: actions.RESET_BALANCE_UPDATED,
  }),
  fetchTransaction: (walletManager) => ({
    type: actions.FETCH_TRANSACTION,
    payload: walletManager,
  }),
  updateAssetValue: (currency) => ({
    type: actions.UPDATE_ASSET_VALUE,
    payload: currency,
  }),
  startFetchPriceTimer: () => ({
    type: actions.START_FETCH_PRICE_TIMER,
  }),
  startFetchBalanceTimer: (walletManager) => ({
    type: actions.START_FETCH_BALANCE_TIMER,
    payload: walletManager,
  }),
  startFetchTransactionTimer: (walletManager) => ({
    type: actions.START_FETCH_TRANSACTION_TIMER,
    payload: walletManager,
  }),
  deleteKey: (key, walletManager) => ({
    type: actions.DELETE_KEY,
    payload: {
      key,
      walletManager,
    },
  }),
  renameKey: (key, name, walletManager) => ({
    type: actions.RENAME_KEY,
    payload: {
      key,
      name,
      walletManager,
    },
  }),
  createKey: (name, phrase, coinIds, walletManager) => ({
    type: actions.CREATE_KEY,
    payload: {
      name,
      phrase,
      coinIds,
      walletManager,
    },
  }),
};

export default actions;
