import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Switch, ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BasePageGereral from '../base/base.page.general';
import Header from '../../components/headers/header';
import color from '../../assets/styles/color.ts';
import space from '../../assets/styles/space';
import Loc from '../../components/common/misc/loc';
import coinType from '../../common/wallet/cointype';
import common from '../../common/common';
import config from '../../../config';
import references from '../../assets/references';

const styles = StyleSheet.create({
  enabledAssetsView: {
    flexDirection: 'row',
  },
  enabledAssetsText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
    letterSpacing: -0.44,
  },
  note: {
    color: color.white,
    fontFamily: 'Avenir-Book',
    fontSize: 15,
    letterSpacing: 0.07,
    marginTop: 14,
  },
  body: {
    marginTop: -32,
    marginHorizontal: 24,
  },
  addCustomTokenView: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    flex: 1,
  },
  addCustomTokenText: {
    color: color.white,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: color.white,
    alignItems: 'center',
    height: 67,
    marginTop: 10,
    borderRadius: 10,
  },
  rowTitle: {
    marginLeft: 20,
    flex: 1,
  },
  icon: {
    marginLeft: 20,
  },
  switch: {
    marginRight: 20,
  },
  rightButtonView: {
    position: 'absolute',
    bottom: 94,
    right: 0,
  },
  cornerButton: {
    height: 67,
    width: 129,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  cornerButtonText: {
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    marginLeft: 13,
  },
  cornerButtonPlus: {
    color: '#00BA00',
    fontFamily: 'Avenir-Medium',
    fontSize: 20,
  },
});

export default class AddToken extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  static getSelectedTokenCount(listData) {
    let count = 0;
    _.each(listData, (item) => {
      count += item.selected;
    });
    return count;
  }

  static createListData() {
    const listData = [];
    const { consts: { supportedTokens } } = config;
    _.each(supportedTokens, (token) => {
      const { icon } = coinType[token];
      const item = { name: token, icon, selected: false };
      listData.push(item);
      const coinId = `${token}Testnet`;
      const { icon: testIcon } = coinType[coinId];
      const name = common.getSymbolFullName(token, 'Testnet');
      const testItem = { name, icon: testIcon, selected: false };
      listData.push(testItem);
    });
    return listData;
  }

  constructor(props) {
    super(props);
    this.onSwitchValueChanged = this.onSwitchValueChanged.bind(this);
    this.onAddCustomTokenPressed = this.onAddCustomTokenPressed.bind(this);
    const listData = AddToken.createListData();
    const selectedTokenCount = AddToken.getSelectedTokenCount(listData);
    this.state = { listData, tokenCount: listData.length, selectedTokenCount };
  }

  onSwitchValueChanged(index, value) {
    const { listData } = this.state;
    listData[index].selected = value;
    const selectedTokenCount = AddToken.getSelectedTokenCount(listData);
    this.setState({ listData, selectedTokenCount });
  }

  onAddCustomTokenPressed() {
    const { navigation } = this.props;
    navigation.navigate('AddCustomToken', navigation.state.params);
  }

  renderList() {
    const { listData } = this.state;
    return (
      <FlatList
        style={space.marginBottom_4}
        extraData={this.state}
        data={listData}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index === 0 ? space.marginTop_0 : 0]}>
            <Image style={styles.icon} source={item.icon} />
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Switch
              style={styles.switch}
              value={item.selected}
              onValueChange={(value) => this.onSwitchValueChanged(index, value)}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  render() {
    const { navigation } = this.props;
    const { selectedTokenCount, tokenCount } = this.state;

    const customButton = (
      <TouchableOpacity style={styles.addCustomTokenView} onPress={this.onAddCustomTokenPressed}>
        <Text style={styles.addCustomTokenText}>+ Add Custom Tokens</Text>
      </TouchableOpacity>
    );

    const rightButton = () => (
      <TouchableOpacity style={styles.rightButtonView} onPress={this.onAddCustomTokenPressed}>
        <ImageBackground source={references.images.cornerButton} style={styles.cornerButton}>
          <Text style={styles.cornerButtonText}>
            <Text style={styles.cornerButtonPlus}>+ </Text>
            Custom
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );

    const header = (
      <Header
        onBackButtonPress={() => navigation.goBack()}
        title="page.wallet.addToken.title"
        rightBtn={rightButton}
      />
    );

    return (
      <BasePageGereral
        isViewWrapper
        isSafeView
        customBottomButton={customButton}
        hasLoader={false}
        bgColor="#00B520"
        headerComponent={header}
      >
        <View style={[styles.body, { flex: 1 }]}>
          <View style={styles.enabledAssetsView}>
            <Loc style={styles.enabledAssetsText} text="page.wallet.addToken.enabledAssets" />
            <Text style={styles.enabledAssetsText}>
              {` (${selectedTokenCount}/${tokenCount})`}
            </Text>
          </View>
          <Loc style={[styles.note, space.marginBottom_17]} text="page.wallet.addToken.note" />
          { this.renderList() }
        </View>
      </BasePageGereral>
    );
  }
}

AddToken.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};
