import { endpoints } from '@/config/endpoints';
import axios from 'axios';
import { ZIM } from 'zego-zim-web';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const appID = 1245279888; // Replace with your App ID from ZEGOCLOUD
ZIM.create({ appID });
const zim = ZIM.getInstance();
let zp: ReturnType<typeof ZegoUIKitPrebuilt.create> | null = null;

/**
 * Initializes ZIM and ZegoUIKitPrebuilt.
 * @param userID - The user's ID.
 * @param userName - The user's name.
 */
export const initZIM = async (userID: string, userName: string) => {
  try {
    const token = await fetchToken(userID);
    if (!token) throw new Error("Token generation failed.");

    zim.login({ userID, userName }, token as string)
      .then(async () => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
           userID,
          userID,
          userName
        );

        zp = await ZegoUIKitPrebuilt.create(kitToken);
        zp.addPlugins({ ZIM });
      })


    console.info("ZIM and ZegoUIKitPrebuilt initialized successfully.");
  } catch (err) {
    console.error("Error initializing ZIM or ZegoUIKitPrebuilt:", err);
  }
};

/**
 * Fetches a token for the given userId.
 * @param userId - The user's ID.
 * @param payload - Optional payload for token generation.
 * @returns A token string.
 */
async function fetchToken(userId: string, payload = ''): Promise<string | null> {
  try {
    const response = await axios.post(`${endpoints["zego"]}`, {
      userId,
      payload,
      appId: appID,
      secret: "8373e07a913fe3caaeca84ed4dc155ff",
    });

    if (response.data.success) {
      return response.data.token;
    } else {
      throw new Error(response.data.errorMessage || 'Failed to fetch token.');
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
}

/**
 * Sends a message to a specific user.
 * @param toUserID - The recipient's user ID.
 * @param message - The message content.
 * @returns The sent message.
 */
export const sendMessage = async (toUserID: string, message: string) => {
  try {
    if (!zp) {
      console.warn("ZegoUIKitPrebuilt instance is not initialized.");
      return;
    }

    const msg = {
      type: ZIM.MessageType.Text,
      message,
    };
    const zimMessage = await zim.sendMessage(msg, toUserID, ZIM.ConversationType.Peer, {
      priority: ZIM.MessagePriority.High,
    });
    return zimMessage.message;
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

export { zim, zp };
