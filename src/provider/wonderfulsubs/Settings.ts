import DefaultSettingsController from '../../settings/settings';

class WonderfulSettings extends DefaultSettingsController {
    getDefaultSettings():any {
        return  {
            language: "dubs",
            quality: 5000000
        }
    }
}

export default WonderfulSettings;