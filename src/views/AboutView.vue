<template>
  <article class="about">
    <div class="tiles">
      <div class="tile page-header app-width-padding">
        <div class="tile is-child">
          <div class="is-flex is-flex-direction-row title-tile">
            <p class="title">Thèses de l'École nationale des chartes</p>
            <p class="header-baseline">
              <span>Position</span> : à l’origine, les positions prises et à défendre par
              l’élève, face au jury. Depuis, un résumé de la thèse soutenue.
            </p>
          </div>
        </div>
      </div>
    </div>
    <section class="main container content app-width-margin">
      <h2>Les thèses de l’École des chartes</h2>
      <p>
        Depuis 1849, les élèves de l’École nationale des chartes soutiennent une thèse d’École qui conditionne
        l’obtention du diplôme d’archiviste paléographe. Cette thèse est l’aboutissement d’un cursus d’enseignements
        consacrés aux disciplines historiques ayant pour objectif la formation de personnels scientifiques des
        institutions patrimoniales et de recherche. Fondées majoritairement sur l’étude de sources inédites, ces thèses
        sont garantes de l’excellence scientifique des élèves qui se destinent aux métiers de la conservation et de la
        recherche.
      </p>
      <h2>Les positions de thèses</h2>
      <p>
        Chaque année, dès 1849, un volume des <i>Positions des thèses</i> soutenues est publié : les élèves y énoncent
        les points de doctrine (les <i>positions</i>) à défendre face au jury. Progressivement ces énumérations brèves
        des hypothèses soutenues se sont étoffées pour devenir des résumés détaillés des thèses. Ce site offre la
        recherche et la consultation en plein texte du corpus intégral de ces positions, témoin rare de l’évolution des
        disciplines historiques dans leur ensemble. Certains travaux ont en outre été pionniers dans le renouvellement
        des méthodes d’analyse et d’étude en histoire. Une appréhension globale de ce corpus offre ainsi un cadre
        exceptionnel pour étudier l’évolution des concepts historiographiques en France depuis le milieu du
        XIX<sup>e</sup> siècle.
      </p>
      <p>
        Pour favoriser les études historiographiques, l’application est construite sur <a
          href="https://theses.chartes.psl.eu/documentation">différentes API</a> qui standardisent l’accès à toutes les
        ressources disponibles (textes, images et recherche) et en font une véritable plateforme d’accès aux données
        ouvertes. Cette application entend répondre aux exigences éditoriales de l’accès libre et aux attentes
        scientifiques combinées de l’ouverture des données.
      </p>
      <p>
        Les volumes de la collection éditée par les Éditions de l’École des chartes sont aussi consultables sous forme
        imprimée. Les années postérieures à 1960 sont disponibles à la vente sous format papier à l’<a
          href="http://www.chartes.psl.eu/recherche/bundle/publication/im_field_collection/positions-these-33">École des
        chartes</a> et sur le <a
          href="https://www.lcdpu.fr/recherche/index.cfm?fa=recherche&searchtext=positions+des+thèses&x=0&y=0">Comptoir
        des presses d’universités</a>.
      </p>
      <h2>Consultation des thèses : ThENC@</h2>
      <p>
        Propriété de leur auteur jusqu’en 1961, de nombreuses thèses anciennes se retrouvent dans différentes
        institutions patrimoniales que les auteurs ont fréquentées dans le cadre de leur recherche ou plus tard dans
        l’exercice de leur profession. Si une partie d’entre elles est déjà identifiée, un travail de prospection pour
        localiser davantage de thèses est en cours dans le cadre du projet ThENC@. À partir de 1961, toutes les thèses
        d’École pour l’obtention du diplôme d’archiviste paléographe sont conservées au département des archives privées
        aux Archives nationales sous la cote AB XXVIII.
      </p>
      <p>
        Le site <a href="https://bibnum.chartes.psl.eu/s/thenca/page/accueil">ThENC@</a> recense toutes les informations
        disponibles à ce jour sur les thèses et constitue le point d’accès privilégié à leur consultation.
      </p>
      <p>
        Dès que cela est possible, les notices des positions pointent vers les notices correspondantes des thèses,
        consultables sur le site <a href="https://bibnum.chartes.psl.eu/s/thenca/page/accueil">ThENC@</a>.
      </p>
    </section>
  </article>
</template>

<style>
article.about {
  margin-top: 0;
}
.about .content {
  font-family: "Libre Baskerville", serif !important;
  font-size: 16px;
  text-align: left;
  font-weight: 400;
  line-height: 28px;
  color: #5F5F5F;
  text-indent: 0;
  padding: 0 8% 100px;
}
.about .content p,
.about .content ul {
  font-family: "Barlow", sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 32px;
  color: #5F5F5F;
}
.about .content p {
  text-align: left;
  text-indent: 0;
}
.about .content ul {
  padding-bottom: 10px;
  margin-left: 0;
  list-style-position: inside;
}
.about .content ul > li {
  margin-bottom: 0;
}
.about .content h1,
.about .content h2 {
  padding-top: 0;
}
.about .content h1 {
  margin: 30px 0 !important;
  font-family: "Noto Serif", serif;
  font-weight: 400;
  font-style: normal;
  font-size: 30px;
  line-height: 42px;
}
.about .content h2 {
  margin: 70px 0 30px !important;
  font-family: "Barlow", sans-serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 34px;
  color: #B9192F;
}

@media screen and (max-width: 800px) {
  .about .content {
    padding: 0 20px 50px;
  }
  .about .content p,
  .about .content ul {
    font-size: 16px;
    line-height: 24px;
  }
  .about .content p {
    margin: 0 0 !important;
  }
  .about .content ul {
    list-style-position: inside;
    margin: 20px 0 !important;
  }
  .about .content h1 {
    width: 80%;
    margin: 35px 0 !important;
    font-size: 30px;
    line-height: 36px;
  }
  .about .content h1,
  .about .content h2 {
    text-align: left;
    width: 80%;
  }
}

</style>
