import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Loc from '../../components/common/misc/loc';
import Header from '../../components/headers/header';
import appActions from '../../redux/app/actions';
import BasePageGereral from '../base/base.page.general';
import common from '../../common/common';

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    width: '85%',
  },
  title: {
    color: '#2D2D2D',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 22,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
});

class TwoFactorAuth extends Component {
    static navigationOptions = () => ({
      header: null,
    });

    constructor(props) {
      super(props);

      this.onResetPasscodePress = this.onResetPasscodePress.bind(this);
      this.setSingleSettings = this.setSingleSettings.bind(this);

      this.state = {
        biometryType: '',
      };
    }

    componentDidMount() {
      common.getFingerprintType()
        .then((biometryType) => this.setState({ biometryType }));
    }

    onResetPasscodePress() {
      const { passcode, showPasscode, navigation } = this.props;
      if (passcode) {
        showPasscode('reset', () => navigation.navigate('ResetPasscodeSuccess', { operation: 'reset' }));
      } else {
        showPasscode('create', () => navigation.navigate('ResetPasscodeSuccess', { operation: 'create' }));
      }
    }

    setSingleSettings(value) {
      const { setSingleSettings } = this.props;
      setSingleSettings('fingerprint', value);
    }

    render() {
      const { navigation, passcode, fingerprint } = this.props;
      const { biometryType } = this.state;
      const setPasscodeText = passcode ? 'page.mine.2fa.resetPasscode' : 'page.mine.2fa.setPasscode';

      let useFingerSwitchRow = null;
      // Show use fingerprint switch row if fingerprint is available.

      if (biometryType) {
        const text = biometryType === 'Face ID' ? 'page.mine.2fa.useFaceID' : 'page.mine.2fa.useFingerprint';
        useFingerSwitchRow = (
          <View style={styles.row}>
            <Loc style={[styles.title]} text={text} />
            <Switch value={fingerprint} onValueChange={this.setSingleSettings} />
          </View>
        );
      }

      return (
        <BasePageGereral
          isSafeView={false}
          hasBottomBtn={false}
          hasLoader={false}
          headerComponent={<Header onBackButtonPress={() => navigation.goBack()} title="page.mine.2fa.title" />}
        >
          <View style={styles.body}>
            <TouchableOpacity style={styles.row} onPress={this.onResetPasscodePress}>
              <Loc style={[styles.title]} text={setPasscodeText} />
              <Entypo name="chevron-small-right" size={35} style={styles.chevron} />
            </TouchableOpacity>
            {useFingerSwitchRow}
          </View>
        </BasePageGereral>
      );
    }
}

TwoFactorAuth.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  setSingleSettings: PropTypes.func,
  showPasscode: PropTypes.func.isRequired,
  fingerprint: PropTypes.bool,
  passcode: PropTypes.string,
};


TwoFactorAuth.defaultProps = {
  setSingleSettings: undefined,
  fingerprint: undefined,
  passcode: undefined,
};

const mapStateToProps = (state) => ({
  fingerprint: state.App.get('fingerprint'),
  passcode: state.App.get('passcode'),
});

const mapDispatchToProps = (dispatch) => ({
  setSingleSettings: (key, value) => dispatch(appActions.setSingleSettings(key, value)),
  showPasscode: (category, callback) => dispatch(
    appActions.showPasscode(category, callback),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorAuth);
