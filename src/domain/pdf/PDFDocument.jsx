/* eslint-disable react/prop-types */
// src/presentation/components/pdf/PDFDocument.jsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { memo } from 'react';

// Register custom fonts with absolute paths
Font.register({
  family: 'EBGaramond',
  fonts: [
    { src: '/fonts/EB_Garamond/static/EBGaramond-Regular.ttf' },
    { src: '/fonts/EB_Garamond/static/EBGaramond-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/EB_Garamond/static/EBGaramond-Italic.ttf', fontStyle: 'italic' }
  ]
});

// Updated styles with all necessary properties
const styles = StyleSheet.create({
  page: {
    padding: 54,
    backgroundColor: 'white'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  headerContact: {
    fontSize: 10,
    fontFamily: 'EBGaramond',
    marginBottom: 10
  },
  headerName: {
    fontSize: 24,
    fontFamily: 'EBGaramond',
    fontWeight: 700,
    marginBottom: 4
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'EBGaramond',
    fontStyle: 'italic',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'EBGaramond',
    fontWeight: 700,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    marginBottom: 8
  },
  summaryText: {
    fontSize: 10,
    fontFamily: 'EBGaramond',
    textAlign: 'justify',
    lineHeight: 1.5
  },
  workEntry: {
    marginBottom: 15
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  workTitle: {
    fontSize: 11,
    fontFamily: 'EBGaramond',
    fontWeight: 700
  },
  workCompany: {
    fontSize: 11,
    fontFamily: 'EBGaramond',
    fontStyle: 'italic'
  },
  achievementBullet: {
    width: 10,
    fontSize: 8,
    fontFamily: 'EBGaramond'
  },
  achievementText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'EBGaramond',
    textAlign: 'justify',
    paddingLeft: 10
  },
  educationEntry: {
    marginBottom: 10
  },
  description: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: 'EBGaramond'
  },
  skillCategory: {
    marginBottom: 8
  },
  skillCategoryName: {
    fontWeight: 700,
    marginBottom: 2,
    fontSize: 10,
    fontFamily: 'EBGaramond'
  },
  skillList: {
    fontSize: 10,
    fontFamily: 'EBGaramond'
  }
});

const HeaderSection = memo(({ personal }) => (
  <View style={styles.header}>
    <Text style={styles.headerContact}>
      {`${personal?.location?.toUpperCase() || ''} • ${personal?.email?.toUpperCase() || ''} • ${personal?.phone || ''}`}
    </Text>
    <Text style={styles.headerName}>
      {personal?.fullName?.toUpperCase() || ''}
    </Text>
    <Text style={styles.headerTitle}>
      {personal?.title || ''}
    </Text>
  </View>
));
HeaderSection.displayName = 'HeaderSection';

const SummarySection = memo(({ summary }) => {
  if (!summary?.trim()) return null;
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <View style={styles.divider} />
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
});
SummarySection.displayName = 'SummarySection';

const WorkEntry = memo(({ job }) => (
  <View style={styles.workEntry}>
    <View style={styles.workHeader}>
      <Text style={styles.workTitle}>{job.position?.toUpperCase() || ''}</Text>
      <Text style={styles.workTitle}>
        {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : ''}
      </Text>
    </View>
    <View style={styles.workHeader}>
      <Text style={styles.workCompany}>{job.company || ''}</Text>
      <Text style={styles.workCompany}>{job.location || ''}</Text>
    </View>
    {job.achievements?.map((achievement, i) => (
      achievement?.trim() ? (
        <View key={i} style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ ...styles.achievementText, flex: 0, paddingLeft: 0, paddingRight: 5 }}>•</Text>
          <Text style={styles.achievementText}>{achievement}</Text>
        </View>
      ) : null
    ))}
  </View>
));

WorkEntry.displayName = 'WorkEntry';

const WorkSection = memo(({ work }) => {
  if (!work?.length) return null;

  const hasContent = work.some(entry =>
    entry.position?.trim() ||
    entry.company?.trim() ||
    entry.achievements?.some(a => a?.trim())
  );

  if (!hasContent) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>Employment History</Text>
      <View style={styles.divider} />
      {work.map((job, index) => (
        <WorkEntry key={index} job={job} />
      ))}
    </View>
  );
});

WorkSection.displayName = 'WorkSection';

const EducationSection = memo(({ education }) => {
  if (!education?.length) return null;

  const hasValidEntries = education.some(edu =>
    edu.degree?.trim() || edu.institution?.trim() || (edu.description?.some(point => point?.trim()))
  );

  if (!hasValidEntries) return null; // Prevent rendering if no meaningful content


  return (
    <View>
      <Text style={styles.sectionTitle}>Education</Text>
      <View style={styles.divider} />
      {education.map((edu, index) => (
        <View key={index} style={styles.educationEntry}>
          <View style={styles.workHeader}>
            <Text style={styles.workTitle}>{edu.degree}</Text>
            <Text style={styles.workTitle}>{`${edu.startDate} - ${edu.endDate}`}</Text>
          </View>
          <View style={styles.workHeader}>
            <Text style={styles.workCompany}>{edu.institution}</Text>
            <Text style={styles.workCompany}>{edu.location}</Text>
          </View>
          {edu.description?.map((point, i) => (
            point?.trim() ? (
              <View key={i} style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ ...styles.achievementText, flex: 0, paddingLeft: 0, paddingRight: 5 }}>•</Text>
                <Text style={styles.achievementText}>{point}</Text>
              </View>
            ) : null
          ))}
        </View>
      ))}
    </View>
  );
});
EducationSection.displayName = 'EducationSection';

const SkillsSection = memo(({ skills }) => {
  if (!skills?.length) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.divider} />
      {skills.map((category, index) => (
        <View key={index} style={styles.skillCategory}>
          <Text style={styles.skillCategoryName}>{category.name}</Text>
          <Text style={styles.skillList}>
            {category.skills.filter(skill => skill.trim()).join(' • ')}
          </Text>
        </View>
      ))}
    </View>
  );
});
SkillsSection.displayName = 'SkillsSection';

const PDFDocument = memo(({ data }) => {
  const resume = data.resume

  const renderedSections = new Set();


  const renderSection = (sectionId) => {
    // If section was already rendered, skip it
    if (renderedSections.has(sectionId)) {
      console.warn(`Prevented duplicate render of section: ${sectionId}`);
      return null;
    }

    // Mark section as rendered
    renderedSections.add(sectionId);

    // Existing switch statement
    switch (sectionId) {
      case 'personal':
        return <HeaderSection personal={resume?.personal} />;
      case 'summary':
        return <SummarySection summary={resume?.summary} />;
      case 'work':
        return <WorkSection work={resume?.work} />;
      case 'education':
        return <EducationSection education={resume?.education} />;
      case 'skills':
        return <SkillsSection skills={resume?.skills} />;
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

PDFDocument.displayName = 'PDFDocument';

export default PDFDocument;