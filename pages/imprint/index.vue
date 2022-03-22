<template>
  <div>

    <section class="main-content" v-if="!!legalNotice">
      <div id="content" class="container">
        <div class="container">
          <div class="imprint">
            <section class="main-content">
              <div id="content" class="container">
                <div lang="en"><h2>Legal disclosure according to &sect;&sect; 24, 25 Austrian media law and &sect;
                  5 E-Commerce law:</h2>
                  <h3>Media owner, publisher, responsible for content and editorial office,
                    service provider:</h3>
                  <p><a href="http://www.oeaw.ac.at">Austrian Academy of Sciences</a><br/>Corporate
                    body organized under public law (BGBl 569/1921 idF BGBl I 130/2003)<br/><a
                      href="https://acdh.oeaw.ac.at"
                    >Austrian Centre for Digital Humanities and Cultural Heritage (ACDH-CH)</a><br/>Dr. Ignaz
                    Seipel-Platz
                    2, 1010 Vienna, Austria<br/>E-Mail: <a style="color: black;"
                                                           href="mailto:acdh-tech@oeaw.ac.att"
                    >acdh-tech@oeaw.ac.at</a></p>
                  <h3><strong>Nature and purpose
                    of the business:</strong></h3>
                  <p>The Austrian Academy of Sciences (OEAW) has the legal duty to
                    support the sciences and humanities in every respect. As a learned society, the OEAW fosters
                    discourse
                    and cooperation between science and society, politics and economy.<br/>The Austrian Centre for
                    Digital
                    Humanities and Cultural Heritage (ACDH-CH) is an OEAW institute founded with the goal to support
                    digital methods in arts and humanities disciplines. The ACDH-CH supports digital research in
                    manifold
                    ways.<br/>The project is focusing on Austrian dialect cartography from 1924 to 1956.</p>
                  <h3>
                    <strong>Signing power:</strong></h3>
                  <p>President: o. Univ.-Prof. Dr. Anton Zeilinger<br/>Vice
                    President: Univ.-Prof. Dr. phil. Arnold Suppan<br/>Class President: Univ.-Prof. Dr. phil. Oliver
                    Jens
                    Schmitt<br/>Class President: Univ.-Prof. Dipl.-Ing. Dr.techn. Georg Brasseur<br/>The Academy Council
                    exists as supervisory body. For more information see <a
                      href="https://www.oeaw.ac.at/en/oeaw/bodies/academy-council/" target="_blank" rel="noopener"
                    >https://www.oeaw.ac.at/en/oeaw/bodies/academy-council/</a></p>
                  <h3><strong>Main aim:</strong></h3>
                  <p>Data entry for the CONNEC project - Connected Clerics. Building a Universal Church in the Late
                    Antique West</p>
                  <h3><strong>Disclaimer:</strong></h3>
                  <p>The Austrian Academy of Sciences
                    does not take responsibility for the nature, accuracy, entirety or quality of the provided
                    information.<br/>In the case of links to websites of other media owners, whose content the OEAW is
                    neither directly nor indirectly responsible for, the OEAW does not assume liability for their
                    content and excludes any liability in this case.</p>
                  <h3><strong>Data privacy notice:</strong>
                  </h3>
                  <p>By using this website, you agree to the manner and purposes of data processing. You can
                    disable cookies in your browser settings. However, this might limit functionality of this
                    website.<br/>Please find the &Ouml;AW's detailed data privacy statement <a
                      href="https://www.oeaw.ac.at/die-oeaw/datenschutz/"
                    >here</a>. The contact data published in the context of the imprint duty may not be used to send
                    promotional or informational material not explicitly requested. We explicitly disagree with this
                    usage.</p>
                </div>

              </div>

            </section>

          </div>

        </div>

      </div>

    </section>
    <div v-else v-html="legalNotice"></div>
  </div>
</template>

<script>
export default {

  name: 'index',
  async fetch() {
    // eslint-disable-next-line no-underscore-dangle
    const p = await this.$api.Content.get_api_0_3_content_();
    // eslint-disable-next-line prefer-destructuring
    this.legalNotice = p.body.legalNotice;
  },
  data() {
    return {
      legalNotice: undefined
    };
  },
  mounted() {
    this.$fetch();
  }
};
</script>

<style scoped>

</style>
