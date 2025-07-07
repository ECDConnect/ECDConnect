import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { MoreInformation } from '@ecdlink/graphql';

class InfoService {
  async getMoreInformation(
    section: string,
    locale: string
  ): Promise<MoreInformation[]> {
    const apiInstance = api(Config.graphQlApi);
    const response = await apiInstance.post<{
      data: { moreInformation: MoreInformation[] };
      errors?: {};
    }>(``, {
      query: `
        query GetMoreInformation($section: String, $locale: String) {
          moreInformation(section: $section, locale: $locale){
            descriptionA
            descriptionAColor
            descriptionB
            descriptionBColor
            descriptionBIcon
            descriptionC
            descriptionCColor
            descriptionD
            descriptionDColor
            descriptionDIcon
            headerA
            headerB
            headerC
            headerD
            id
            infoBoxDescription
            infoBoxIcon
            infoBoxTitle
            section
            showDividerA
            showDividerB
            showDividerC
            type
            visit
          }
        }    
        `,
      variables: {
        section,
        locale,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get More Information Failed - Server connection error');
    }

    return response.data.data.moreInformation;
  }
}

export default InfoService;
