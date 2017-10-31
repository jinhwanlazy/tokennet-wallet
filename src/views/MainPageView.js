import React, { Component } from 'react';
import symbolImage from 'assets/imgs/boscoin-symbol-image.png';
import BlueButton from 'components/BlueButton';
import './MainPageView.scss';
import { connect } from "react-redux";
import * as actions from "actions/index";
import { Redirect } from "react-router-dom";
import T from 'i18n-react';

import { StellarServer } from 'libs/stellar-toolkit';
import pageview from 'utils/pageview';

const { generateTestPair } = StellarServer;
const config = require( 'config.json' );

class MainPageView extends Component {
	constructor() {
		super();

		this.state = {
			redirect: null,
			contentBottom: false,
			show: true,
			hasError: true,
		};
	}

	clickMakeNewKey = () => {
		this.props.showGeneratorConfirm( true );
	};

	clickOpenYourWallet = () => {
		this.setState( { redirect: '/login' } );
	};

	renderRedirect() {
		if ( this.state.redirect === null ) {
			return '';
		}
		else {
			return <Redirect to={this.state.redirect}/>
		}
	}

	createAccount() {
		this.props.showSpinner( true );
		generateTestPair()
			.then( ( newPair ) => {
				this.props.showSpinner( false );
				this.props.updateKeypair( newPair );
				this.props.showGeneratorConfirm( false );
				this.props.showKeyGenerator( true );
			} );
	}

	render() {
		return (
			<div id="main-page-container" className="main-page-container">
				{this.renderRedirect()}
				<div className="content-container">
					<div className="content-middle-wrapper">
						<div className="content-wrapper">
							<div>
								<img className={'main-logo'} src={symbolImage} alt="BOSCoin symbol"/>

								<T.p className={'title'} text="welcome_view.title"/>
								<T.p text="welcome_view.title_description"/>

								<p dangerouslySetInnerHTML={{ __html: this.props.maintenance.message }}/>

								<div className={'button-group'}>
									{config.active_make_a_new_key&&
									<div>
										<BlueButton big disabled={ this.props.maintenance.onMaintenance }
													onClick={this.clickMakeNewKey}>
											<T.span text="welcome_view.button_make"/>
										</BlueButton>
									</div>
									}

									{config.active_create_test_account&&
									<div>
										<BlueButton big disabled={ this.props.maintenance.onMaintenance }
													onClick={() => this.createAccount()}>
											<T.span text="welcome_view.create_account"/>
										</BlueButton>
									</div>
									}

									<div>
										<BlueButton big disabled={ this.props.maintenance.onMaintenance }
													onClick={this.clickOpenYourWallet}>
											<T.span text="welcome_view.button_open"/>
										</BlueButton>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	componentDidMount() {
		pageview();
	}
}

const mapStoreToProps = ( store ) => ({
	maintenance: store.maintenance,
});

const mapDispatchToProps = ( dispatch ) => ({
	showGeneratorConfirm: ( $isShow ) => {
		dispatch( actions.showGeneratorConfirm( $isShow ) );
	},
	showSpinner: ( $isShow ) => {
		dispatch( actions.showSpinner( $isShow ) );
	},
	showKeyGenerator: ( $isShow ) => {
		dispatch( actions.showKeyGenerator( $isShow ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
	},
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
});

MainPageView = connect( mapStoreToProps, mapDispatchToProps )( MainPageView );

export default MainPageView;