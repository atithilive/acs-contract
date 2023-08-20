const { Application, genesisBlockDevnet, configDevnet,utils,HTTPAPIPlugin,} = require('lisk-sdk');
const {AtithiModule}=require("./module")
const {AtithiAPIPlugin}=require("./plugins")
genesisBlockDevnet.header.timestamp = 1691179860;
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
	(a) =>
		utils.objects.mergeDeep({}, a, {
			atithi: {
				generalDetails: {
					name:"",
					mobileNumber:0,
					email:"",
					hotelId:Buffer.from(''),
				},
				superAdmin:false

			},
		}),
);

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'atithi-app',
	genesisConfig: { communityIdentifier: 'ATITHI' }, //In order to have a unique networkIdentifier
	logger: {
		consoleLogLevel: 'info',
	},
});
const app = Application.defaultApplication(genesisBlockDevnet, appConfig);
app.registerModule(AtithiModule);
app.registerPlugin(AtithiAPIPlugin)
app.registerPlugin(HTTPAPIPlugin);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});