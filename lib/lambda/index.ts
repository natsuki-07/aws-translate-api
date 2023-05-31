import { Handler } from 'aws-cdk-lib/aws-lambda'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as aws from 'aws-sdk'

type languageCode = 'ja' | 'en'

const translate = new aws.Translate()
export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body!)
  const text = body.text
  const data = await getTranslate(text, 'en', 'ja')
  
  return { statusCode: 200, body: data.TranslatedText };
};

const getTranslate = (text: string, from_ln: languageCode, to_ln: languageCode): Promise<aws.Translate.Types.TranslateTextResponse> => {
  return new Promise((resolve, reject) => {
    translate.translateText({
      Text: text,
      SourceLanguageCode: from_ln,
      TargetLanguageCode: to_ln,
    }, (err, data) =>{
      if (err) {
        console.log(err)
        reject()        
      } else {
        resolve(data)
      }
    })
  }) 
}