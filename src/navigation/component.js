import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';

import UpdateModal from '../components/update/update.modal';
import Start from '../pages/start/start';
import TermsPage from '../pages/start/terms';
import PrimaryTabNavigatorComp from './tab.primary';
import Notifications from '../components/common/notification/notifications';
import Confirmation from '../components/common/confirmation/confirmation';
import PasscodeModals from '../components/common/passcode/passcode.modals';
import TouchSensorModal from '../components/common/modal/touchSensorModal';
import flex from '../assets/styles/layout.flex';
import Toast from '../components/common/notification/toast';
import InAppNotification from '../components/common/inapp.notification/notification';

const SwitchNavi = createAppContainer(createSwitchNavigator(
  {
    Start: {
      screen: Start,
      path: 'start',
    },
    PrimaryTabNavigator: {
      screen: PrimaryTabNavigatorComp,
      path: 'tab',
    },
    TermsPage: {
      screen: TermsPage,
      path: 'terms',
    },
  },
  {
    initialRouteName: 'Start',
  },
));

const uriPrefix = Platform.OS === 'android' ? 'rwallet://rwallet/' : 'rwallet://rwallet/';
class RootComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStorageRead: false,
      isParseWritten: false,
    };
  }

  /**
   * RootComponent is the main entrace of the App
   * Initialization jobs need to start here
   */
  async componentWillMount() {
    const { initializeFromStorage } = this.props;
    // Load Settings and Wallets from permenate storage
    initializeFromStorage();
  }

  componentWillReceiveProps(nextProps) {
    const {
      isInitFromStorageDone, isInitWithParseDone, initializeWithParse,
      walletManager, currency, prices, isBalanceUpdated,
      initLiveQueryPrice, initLiveQueryBalances, initLiveQueryTransactions, initLiveQueryBlockHeights,
      initFcmChannel,
    } = nextProps;

    const {
      currency: originalCurrency, prices: originalPrices, updateWalletAssetValue, resetBalanceUpdated,
    } = this.props;

    const { isStorageRead, isParseWritten } = this.state;

    const tokens = walletManager.getTokens();

    const newState = this.state;

    if (isStorageRead && isParseWritten) { // Post-Initialization logic
      const isCurrencyChanged = (currency !== originalCurrency);
      const isPricesChanged = (!_.isEqual(prices, originalPrices));
      let needUpdate = false;

      console.log('isBalanceUpdated', isBalanceUpdated, 'isCurrencyChanged', isCurrencyChanged, 'isPricesChanged', isPricesChanged);
      // Update total asset value and list data if there's currency or price change
      // Balance, name, creation/deletion are handled in reducer directly
      if (isBalanceUpdated) {
        needUpdate = true;
        resetBalanceUpdated();
      } else if (isCurrencyChanged || isPricesChanged) {
        needUpdate = true;
      }

      if (needUpdate) {
        updateWalletAssetValue(currency, prices);
      }
    } else if (isInitFromStorageDone) { // Initialization logic
      if (!isInitWithParseDone) {
        // Upload current wallet settings to Parse in order to get balances and transactions
        initializeWithParse();
        // As long as the app initialized from storage, we mark state.isStorageRead to true

        newState.isStorageRead = true;
      } else {
        initLiveQueryPrice();
        initLiveQueryBalances(tokens);
        initLiveQueryTransactions(tokens);
        initLiveQueryBlockHeights();
        initFcmChannel();

        newState.isParseWritten = true;
      }
    }

    this.setState(newState);
  }

  render() {
    const {
      showNotification, notification, removeNotification, notificationCloseCallback,
      showPasscode, passcodeType, closePasscodeModal, passcodeCallback, passcodeFallback,
      isShowConfirmation, confirmation, removeConfirmation, confirmationCallback, confirmationCancelCallback,
      isShowFingerprintModal, hideFingerprintModal, fingerprintCallback, fingerprintFallback, fingerprintUsePasscode,
      isShowInAppNotification, inAppNotification, resetInAppNotification, processNotification,
    } = this.props;

    return (
      <View style={[flex.flex1]}>
        <Root>
          <SwitchNavi uriPrefix={uriPrefix} />
          {false && <UpdateModal showUpdate mandatory={false} />}
          <Notifications showNotification={showNotification} notification={notification} removeNotification={removeNotification} notificationCloseCallback={notificationCloseCallback} />
          <Confirmation isShowConfirmation={isShowConfirmation} confirmation={confirmation} removeConfirmation={removeConfirmation} confirmationCallback={confirmationCallback} confirmationCancelCallback={confirmationCancelCallback} />
          <PasscodeModals showPasscode={showPasscode} passcodeType={passcodeType} closePasscodeModal={closePasscodeModal} passcodeCallback={passcodeCallback} passcodeFallback={passcodeFallback} />
          <TouchSensorModal
            isShowFingerprintModal={isShowFingerprintModal}
            fingerprintCallback={fingerprintCallback}
            fingerprintFallback={fingerprintFallback}
            hideFingerprintModal={hideFingerprintModal}
            fingerprintUsePasscode={fingerprintUsePasscode}
          />
          <Toast ref={(ref) => { this.toast = ref; }} backgroundColor="white" position="top" textColor="green" />
          <InAppNotification isVisiable={isShowInAppNotification} notification={inAppNotification} resetInAppNotification={resetInAppNotification} processNotification={processNotification} />
        </Root>
      </View>
    );
  }
}

RootComponent.propTypes = {
  initializeFromStorage: PropTypes.func.isRequired,
  initializeWithParse: PropTypes.func.isRequired,
  resetBalanceUpdated: PropTypes.func.isRequired,
  updateWalletAssetValue: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({
    getTokens: PropTypes.func,
  }),
  showNotification: PropTypes.bool.isRequired,
  notification: PropTypes.shape({}), // TODO: what is this notification supposed to be?p
  isInitFromStorageDone: PropTypes.bool.isRequired,
  isInitWithParseDone: PropTypes.bool.isRequired,
  isBalanceUpdated: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  prices: PropTypes.arrayOf(PropTypes.object).isRequired,
  showPasscode: PropTypes.bool.isRequired,
  passcodeType: PropTypes.string,
  passcodeCallback: PropTypes.func,
  passcodeFallback: PropTypes.func,
  closePasscodeModal: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  isShowConfirmation: PropTypes.bool.isRequired,
  confirmation: PropTypes.shape({}),
  removeConfirmation: PropTypes.func.isRequired,
  notificationCloseCallback: PropTypes.func,
  confirmationCallback: PropTypes.func,
  confirmationCancelCallback: PropTypes.func,
  isShowFingerprintModal: PropTypes.bool.isRequired,
  hideFingerprintModal: PropTypes.func.isRequired,
  fingerprintCallback: PropTypes.func,
  fingerprintFallback: PropTypes.func,
  fingerprintUsePasscode: PropTypes.func,
  initLiveQueryPrice: PropTypes.func.isRequired,
  initLiveQueryBalances: PropTypes.func.isRequired,
  initLiveQueryTransactions: PropTypes.func.isRequired,
  initLiveQueryBlockHeights: PropTypes.func.isRequired,
  isShowInAppNotification: PropTypes.bool.isRequired,
  inAppNotification: PropTypes.shape({}),
  initFcmChannel: PropTypes.func.isRequired,
  resetInAppNotification: PropTypes.func.isRequired,
  processNotification: PropTypes.func.isRequired,
};

RootComponent.defaultProps = {
  walletManager: undefined,
  notification: null,
  notificationCloseCallback: null,
  passcodeType: null,
  passcodeCallback: null,
  passcodeFallback: null,
  confirmation: null,
  confirmationCallback: null,
  confirmationCancelCallback: null,
  fingerprintCallback: null,
  fingerprintFallback: null,
  fingerprintUsePasscode: null,
  inAppNotification: undefined,
};

export default RootComponent;
