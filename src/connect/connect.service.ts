import { Injectable } from '@nestjs/common';
import {fromSSO} from '@aws-sdk/credential-provider-sso';
import {ConnectClient, StartChatContactCommand, StartChatContactCommandOutput} from '@aws-sdk/client-connect';
import { ConnectParticipantClient, CreateParticipantConnectionCommand, CreateParticipantConnectionCommandInput } from "@aws-sdk/client-connectparticipant"; // ES Modules import

@Injectable()
export class ConnectService {

    connect: any;
    

    constructor() {
    }

    async getClient(): Promise<ConnectClient> {
        try {
            const credentials = await fromSSO({ profile: "Learning"})();
            const client = new ConnectClient({credentials: credentials, region:"us-east-1"});
            return client
        } catch (error) {
            console.log(error);
        }

    }

    async startChat(body : any) : Promise<StartChatContactCommandOutput> {

        //login inspeccionar token 

        try {
            const client = await this.getClient();
            const input = { // StartChatContactRequest
                InstanceId: "", // required
                ContactFlowId: "", // required
                ParticipantDetails: { // ParticipantDetails
                  DisplayName: "JaredHZ", // required
                },
                InitialMessage: { // ChatMessage
                  ContentType: "text/plain", // required
                  Content: "Holi", // required
                }
              };
            const command = new StartChatContactCommand(input);
            const response = await client.send(command);
            return response;
            console.log(response);
        } catch (error) {
            console.log(error);
        }

    }

    async createSession() {
        const {ContactId, ParticipantId, ParticipantToken} = await this.startChat({"DisplayName":"Jared"});
        const credentials = await fromSSO({ profile: "Learning"})();
        const client = new ConnectParticipantClient({credentials:credentials, region:'us-east-1'});
        const input: CreateParticipantConnectionCommandInput = {
        Type: ["WEBSOCKET"],
        ParticipantToken: ParticipantToken
        };
        console.log(input);
        try{
            const command = new CreateParticipantConnectionCommand(input);
            const response = await client.send(command);
            console.log(response);

            //in client send this as topic {"topic":"aws/subscribe","content":{"topics":["aws/chat"]}}
            return response;
        }catch(error) {
            console.log("error");
            console.log(error);
        }
    }

    async addNewParticipanToChat(){
        // to be implemented
    }
 
    buildSuccessfulResponse(result) {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : true,
                'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: JSON.stringify({
                data: { startChatResult: result }
            })
        };
        console.log("RESPONSE" + JSON.stringify(response));
        return response;
    }
    
     buildResponseFailed(err) {
        const response = {
            statusCode: err.statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : true,
                'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: JSON.stringify({
                data: {
                    "Error": err
                }
            })
        };
        return response;
    }


}
