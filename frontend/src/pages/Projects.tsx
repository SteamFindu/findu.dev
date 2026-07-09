import { t } from '@lingui/macro'

export default function Projects() {
  const projects = [
    {
      title: 'findu.dev',
      description: t`You are on it! Built using rust for the backend, postgres for the database and tailwind to help with styling. Currently running on a DigitalOcean droplet.`,
      url: 'https://github.com/SteamFindu/findu.dev',
    },
    {
      title: 'yule to brainz',
      description: t`Small rust script for parsing yule logs created by wacup and uploading the songs to listenbrainz`,
      url: 'https://github.com/SteamFindu/yule-to-brainz',
    },
  ]

  return (
    <div className="max-w-6xl w-full">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Arttu Hiekkanen</h1>
      </div>

      <div className="flex flex-col gap-6 top-0 lg:w-full mt-10">
        {projects.map((project) => (
          <div key={project.title} className="flex flex-col bg-gray-200 p-10 rounded-xl">
            <div className="w-full">
              <h2 className="flex text-2xl">{project.title}</h2>
            </div>
            <div className="w-full mt-5">
              <p className="flex">{project.description}</p>
            </div>
            <div className="w-full mt-5">
              <a className="flex w-20 text-blue-600 hover:underline" href={project.url}>
                {t`Github`}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
