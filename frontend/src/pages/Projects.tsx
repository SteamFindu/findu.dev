import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Projects() {
  const { i18n } = useLingui()
  const projects = [
    {
      title: 'findu.dev',
      description: t`findu.dev description`,
      url: 'https://github.com/SteamFindu/findu.dev',
    },
    {
      title: 'yule to brainz',
      description: t`yule to brainz description`,
      url: 'https://github.com/SteamFindu/yule-to-brainz',
    },
    {
      title: 'FPSdemo',
      description: t`FPSdemo description`,
      url: 'https://github.com/SteamFindu/yule-to-brainz',
    },
  ]

  return (
    <div className="max-w-6xl w-full mx-auto px-6 h-max">
      <div className="flex justify-center bg-aero-500 card-aero rounded-xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight py-2">Arttu Hiekkanen</h1>
      </div>

      <div className="flex flex-col gap-6 w-full mt-10 lg:w-full lg:min-w-10">
        {projects.map((project) => (
          <div key={project.title} className="flex flex-col bg-white/60 card-aero p-6 rounded-2xl border border-slate-100 shadow-soft-lg">
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-slate-900">{project.title}</h2>
            </div>
            <div className="w-full mt-3">
              <p className="text-sm text-slate-700">{project.description}</p>
            </div>
            <div className="w-full mt-4">
              <a className="inline-flex items-center gap-2 text-aero-600 font-medium hover:underline" href={project.url}>
                {t`Github`}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
