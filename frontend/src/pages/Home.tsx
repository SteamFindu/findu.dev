import { t } from '@lingui/macro'
import { i18n } from "@lingui/core";
import { useLingui } from '@lingui/react'
import me from '/src/public/me.jpg'

export default function Home() {
  const { i18n } = useLingui()
  const competences = [
    t`Working with technology`,
    t`Problem solving`,
    t`Learning new things`,
  ]

  return (
    <div className="max-w-6xl w-full mx-auto px-6">
      <div className="flex justify-center bg-aero-500 card-aero rounded-xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight py-2">Arttu Hiekkanen</h1>
      </div>

      <div className="flex flex-col lg:flex-row w-full mt-10 gap-8">
        <div className="w-full lg:w-1/3 flex-col p-2">
          <div className="grid place-content-center">
            <div id="imgdiv">
              <img src={me} alt="profile" className="md:max-w-xs img-rounded" />
            </div>
            <div className="mt-4 w-full card-aero p-6 shadow-soft-lg">
              <h2 className="font-semibold text-lg">{t`Competences:`}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {competences.map((comp, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-aero-500 rounded-full mr-3" />
                    {comp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/2 p-2">
          <div className="card-aero p-6 shadow-soft-lg">
            <p className="text-base text-slate-800">{t`Hi`}</p>
            <br />
            <p className="text-sm text-slate-700">{t`desc1`}</p>
            <br />
            <p className="text-sm text-slate-700">{t`desc2`}</p>
            <br />
            <p className="text-sm text-slate-700">{t`desc3`}</p>
            <p className="break-words mt-4 text-sm">
              {t`Contact me at`}{' '}
              <a href="mailto:arttu.hiekkanen@hotmail.com" className="text-aero-600 font-medium hover:underline">
                arttu.hiekkanen@hotmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
