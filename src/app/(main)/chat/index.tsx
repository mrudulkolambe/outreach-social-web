import { useState, useEffect } from 'react';
import { ZIMKitManager, Common } from '@zegocloud/zimkit-react';
import '@zegocloud/zimkit-react/index.css';

const ChatPage = () => {
  const [appConfig] = useState({
    appID: 1245279888,
    serverSecret: "8373e07a913fe3caaeca84ed4dc155ff",
  });
  const [userInfo] = useState({
    userID: "7057094772",
    userName: "mrudulkolambe",
  });

  useEffect(() => {
    const initializeZIMKit = async () => {
      const zimKit = new ZIMKitManager();
      const token = zimKit.generateKitTokenForTest(appConfig.appID, appConfig.serverSecret, userInfo.userID);
      await zimKit.init(appConfig.appID);
      await zimKit.connectUser(userInfo, token);
    };

    initializeZIMKit();
  }, [appConfig, userInfo]);

  return <div className='flex items-center justify-center h-screen w-screen Poppins'>
    <Common />;
  </div>
};

export default ChatPage;
