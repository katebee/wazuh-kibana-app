/*
 * Wazuh app - React component for registering agents.
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component } from 'react';
// Redux
import store from '../../../../../redux/store';
import WzReduxProvider from '../../../../../redux/wz-redux-provider';
//Wazuh ruleset tables(rules, decoder, lists)
import WzRulesetOverview from './ruleset-overview';
//Information about rule or decoder
import WzRuleInfo from './rule-info';
import WzDecoderInfo from './decoder-info';
import WzRulesetEditor from './ruleset-editor';
import WzListEditor from './list-editor';
import { EuiTabs, EuiTab } from '@elastic/eui';

export default class WzRuleset extends Component {
  _isMount = false;
  constructor(props) {
    super(props);
    this.state = {}; //Init state empty to avoid fails when try to read any parameter and this.state is not defined yet
    this.store = store;

    this.tabs = [
      {
        id: 'rules',
        name: 'Rules'
      },
      {
        id: 'decoders',
        name: 'Decoders'
      },
      {
        id: 'lists',
        name: 'CDB Lists'
      }
    ];
  }

  UNSAFE_componentWillMount() {
    this._isMount = true
    this.store.subscribe(() => {
      const state = this.store.getState().rulesetReducers;
      if (this._isMount) {
        this.setState(state);
        this.setState({ selectedTabId: state.section });
      }
    });
  }

  componentWillUnmount() {
    this._isMount = false;
    // When the component is going to be unmounted the ruleset state is reset
    const { ruleInfo, decoderInfo, listInfo, fileContent, addingRulesetFile } = this.state;
    if (!ruleInfo && !decoderInfo && !listInfo && !fileContent, !addingRulesetFile) this.store.dispatch({ type: 'RESET' });
  }


  renderTabs() {
    return this.tabs.map((tab, index) => (
      <EuiTab
        onClick={() => {
          window.location.href = `#/manager/?tab=${tab.id}`;
        }}
        isSelected={tab.id === this.state.selectedTabId}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  }

  render() {
    const { ruleInfo, decoderInfo, listInfo, fileContent, addingRulesetFile } = this.state;

    return (
      <WzReduxProvider>
        <EuiTabs style={{ margin: '8px 16px 0 16px' }}>{
          this.renderTabs()
        }</EuiTabs>
        {
          ruleInfo && (<WzRuleInfo />)
          || decoderInfo && (<WzDecoderInfo />)
          || listInfo && (<WzListEditor />)
          || (fileContent || addingRulesetFile) && (<WzRulesetEditor />)
          || (<WzRulesetOverview />)
        }
      </WzReduxProvider>
    )
  }
}
