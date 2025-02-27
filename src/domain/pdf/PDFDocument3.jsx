import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { memo } from 'react';

Font.register({
  family: 'EBGaramond',
  fonts: [
    { src: '/fonts/EB_Garamond/static/EBGaramond-Regular.ttf' },
    { src: '/fonts/EB_Garamond/static/EBGaramond-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/EB_Garamond/static/EBGaramond-Italic.ttf', fontStyle: 'italic' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: '40 54',
    fontFamily: 'EBGaramond',
    fontSize: 11,
    color: '#333333'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #DDDDDD',
    paddingBottom: 8
  },
  headerName: {
    fontSize: 36,
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: 'light',
    color: '#000000'
  },
  headerContact: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2
  },
  section: {
    marginTop: 20,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#444444'
  },
  experienceEntry: {
    marginBottom: 15
  },
  experienceHeader: {
    marginBottom: 4
  },
  companyName: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  jobTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#666666',
    marginBottom: 6
  },
  locationDate: {
    color: '#666666',
    fontSize: 11
  },
  bullet: {
    width: 10,
    textAlign: 'left',
    marginRight: 10,
    color: '#666666'
  },
  bulletText: {
    flex: 1,
    color: '#666666'
  },
  achievement: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 0
  },
  skillsSection: {
    marginBottom: 15
  },
  skillCategory: {
    marginBottom: 2
  },
  skillLabel: {
    fontSize: 11,
    width: 65,
    color: '#444444'
  },
  skillList: {
    color: '#666666'
  },
  projectsSection: {
    marginTop: 4
  },
  projectTitle: {
    fontSize: 11,
    marginBottom: 2,
    textTransform: 'uppercase',
    color: '#444444'
  },
  projectDescription: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 8
  },
  award: {
    marginBottom: 4,
    color: '#666666'
  }
});

const HeaderSection = memo(({ personal }) => (
  <View style={styles.header}>
    <Text style={styles.headerName}>{personal?.fullName || ''}</Text>
    <Text style={styles.headerContact}>
      {[
        personal?.email,
        personal?.phone,
        personal?.location
      ].filter(Boolean).join(' | ')}
    </Text>
  </View>
));
HeaderSection.displayName = 'HeaderSection';


const WorkSection = memo(({ work }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Experience</Text>
    {work?.map((job, index) => (
      <View key={index} style={styles.experienceEntry}>
        <View style={styles.experienceHeader}>
          <View style={styles.companyName}>
            <Text>{job.company}</Text>
            <Text style={styles.locationDate}>{job.location}</Text>
          </View>
          <View style={styles.jobTitle}>
            <Text>{job.position}</Text>
            <Text>{`${job.startDate} – ${job.endDate}`}</Text>
          </View>
        </View>
        {job.achievements?.map((achievement, i) => (
          achievement?.trim() ? (
            <View key={i} style={styles.achievement}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{achievement}</Text>
            </View>
          ) : null
        ))}
      </View>
    ))}
  </View>
));
WorkSection.displayName = 'WorkSection';

const SkillsSection = memo(({ skills }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Skills</Text>
    {skills?.map((category, index) => (
      <View key={index} style={styles.skillCategory}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.skillLabel}>{category.name}</Text>
          <Text style={styles.skillList}>{category.skills.join(', ')}</Text>
        </View>
      </View>
    ))}
  </View>
));
SkillsSection.displayName = 'SkillsSection';


const ProjectsSection = memo(({ projects }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Projects</Text>
    {projects?.map((project, index) => (
      <View key={index} style={styles.projectsSection}>
        <Text style={styles.projectTitle}>{project.name}</Text>
        <Text style={styles.projectDescription}>{project.description}</Text>
      </View>
    ))}
  </View>
));
ProjectsSection.displayName = 'ProjectsSection';


const AwardsSection = memo(({ awards }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Awards</Text>
    {awards?.map((award, index) => (
      <View key={index} style={styles.award}>
        <Text>{`${award.title} | ${award.issuer} | ${award.date}`}</Text>
        <Text style={{ fontSize: 10, marginTop: 2 }}>{award.description}</Text>
      </View>
    ))}
  </View>
));
AwardsSection.displayName = 'AwardsSection';


const EducationSection = memo(({ education }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Education</Text>
    {education?.map((edu, index) => (
      <View key={index} style={styles.experienceEntry}>
        <View style={styles.companyName}>
          <Text>{edu.institution}</Text>
          <Text style={styles.locationDate}>{edu.location}</Text>
        </View>
        <View style={styles.jobTitle}>
          <Text>{edu.degree}</Text>
          <Text>{`${edu.startDate} – ${edu.endDate}`}</Text>
        </View>
      </View>
    ))}
  </View>
));
EducationSection.displayName = 'EducationSection';


const PDFTemplate3 = memo(({ data }) => {
  const resume = data.resume;
  const renderedSections = new Set();

  const renderSection = (sectionId) => {
    if (renderedSections.has(sectionId)) return null;
    renderedSections.add(sectionId);

    switch (sectionId) {
      case 'personal':
        return <HeaderSection personal={resume?.personal} />;
      case 'work':
        return <WorkSection work={resume?.work} />;
      case 'skills':
        return <SkillsSection skills={resume?.skills} />;
      case 'projects':
        return <ProjectsSection projects={resume?.projects} />;
      case 'awards':
        return <AwardsSection awards={resume?.awards} />;
      case 'education':
        return <EducationSection education={resume?.education} />;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.ui.sectionOrder.map((section) => (
          <View key={`${section.id}-${renderedSections.size}`}>
            {renderSection(section.id)}
          </View>
        ))}
      </Page>
    </Document>
  );
});

PDFTemplate3.displayName = 'PDFTemplate3';
export default PDFTemplate3;