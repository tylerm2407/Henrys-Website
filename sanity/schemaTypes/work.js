// A single portfolio item — one video or one photo.
// This is the ONLY thing Henry edits. The public site reads these documents.
export default {
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Drives the filter tabs on the gallery.',
      options: {list: ['Highlights', 'Commercial', 'Photography'], layout: 'radio'},
      initialValue: 'Highlights',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
      },
      initialValue: 'video',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      description: 'Drag your file in and wait for Mux to finish processing before publishing.',
      hidden: ({parent}) => parent?.mediaType !== 'video',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'image',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first. The first ~10 also feed the homepage orbit ring — put your strongest reels first.',
      initialValue: 100,
    },
  ],
  orderings: [
    {title: 'Order (first → last)', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'image'},
  },
}
