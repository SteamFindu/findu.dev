import { t } from '@lingui/macro'
import { useI18n } from '@lingui/react'

export default function Home() {
  const { i18n } = useI18n()

  const competences = [
    t`Working with technology`,
    t`Problem solving`,
    t`Learning new things`,
  ]

  const description = i18n.locale === 'en'
    ? 'I am a student studying IT, mostly interested in programming and related technical work.'
    : 'Olen IT-opiskelija, joka on pääasiassa kiinnostunut ohjelmoinnista ja siihen liittyvästä teknisesta työstä.'

  return (
    <div className="max-w-6xl w-full">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Arttu Hiekkanen</h1>
      </div>

      <div className="flex flex-col lg:flex-row top-0 w-full mt-10 gap-8">
        <div className="w-full lg:w-1/2 flex-col p-2">
          <div className="grid place-content-center">
            <div id="imgdiv" className="m-2">
              <img src="/files/me.jpg" alt="profile" className="md:max-w-xs rounded-md" />
            </div>
            <div className="mt-2">
              <h2 className="font-bold">{t`Competences:`}</h2>
              <ul className="mt-2">
                {competences.map((comp, idx) => (
                  <li key={idx} className="mt-2">
                    {comp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-2">
          <p>{t`Hi`}</p>
          <br />
          <p>{description}</p>
          <br />
          <p>
            {t`I have experience using many different programming languages including rust, javascript, c++ and python. I have spent time working on projects inside companies with a team and by myself.`}
          </p>
          <br />
          <p>{t`This site hosts some of the projects I have worked on and serves as a personal portfolio`}</p>
          <br />
          <p className="break-words">
            {t`Contact me at`}{' '}
            <a href="mailto:arttu.hiekkanen@hotmail.com" className="text-blue-600">
              arttu.hiekkanen@hotmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
