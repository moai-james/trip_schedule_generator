import { TripData, LayoutType } from '../types';

const modernLayout = `
# 您的旅行行程

{{#each days}}
## 第 {{dayNumber}} 天

{{#each locations}}
### {{name}} - {{time}}

![{{name}}]({{image}})

{{introduction}}

{{/each}}
{{/each}}
`;

export const generateMarkdown = (tripData: TripData, layout: LayoutType): string => {
  let markdown = modernLayout;

  const daysMarkdown = tripData.days.map((day, dayIndex) => {
    let dayMarkdown = modernLayout
      .split('{{#each days}}')[1]
      .split('{{/each}}')[0]
      .replace('{{dayNumber}}', (dayIndex + 1).toString());

    const locationsMarkdown = day.locations.map(location => {
      let locationMarkdown = dayMarkdown
        .split('{{#each locations}}')[1]
        .split('{{/each}}')[0]
        .replace(/{{name}}/g, location.name)
        .replace('{{time}}', location.time)
        .replace('{{image}}', tripData.images?.[location.name] || '')
        .replace('{{introduction}}', tripData.introductions?.[location.name] || '暫無介紹。');
      return locationMarkdown;
    }).join('\n');

    return dayMarkdown.replace('{{#each locations}}' + dayMarkdown.split('{{#each locations}}')[1].split('{{/each}}')[0] + '{{/each}}', locationsMarkdown);
  }).join('\n');

  markdown = markdown.replace('{{#each days}}' + markdown.split('{{#each days}}')[1].split('{{/each}}')[0] + '{{/each}}', daysMarkdown);

  return markdown;
};