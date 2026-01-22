import type { Report } from '../types/report';
import { cleanCity } from './cleanCity';

export const parseReport = (text: string): Report[] => {
    let currentPage: string[] = [];
    const textArray: string[] = text.split('\n').filter(line => line !== '');
    const pages: string[][] = [];
    const projects: Report[] = [];
    let correspondence: any[] = [];
    
    for (let i = 0; i < textArray.length; i++) {
        const line = textArray[i];
        if (line !== undefined) {
            const match = line.match(/-- \d+ of \d+ --/);
            if (match) {
                currentPage.push(line);
                pages.push(currentPage);
                currentPage = [];
            } else {
                currentPage.push(line);
            }
        }
    }
    
    if (currentPage.length > 0) {
        pages.push(currentPage);
    }
    for (const page of pages) {
        const [projectName, caseNumber] = page[0]?.split(' Case No.: ') || ['', ''];
        const caseNo = caseNumber?.replace('\tProject ID:', '') || ''
        
        
        const existingProject = projects.find(p => p.projectId === projectName?.trim() && p.caseNum === caseNo?.trim());
        
        if (!existingProject) {
            const isCorrespondence = page.includes('Correspondence Information');
            const [lomcType, date] = page[2]?.split('\t') || ['', ''];
            const dueDateLine = page[3]?.includes(' Projected Due Date:') ? page[3]?.replace(' Projected Due Date:', '').split(' ') : undefined;
            const [group, projectStatus] = page[6]?.split(' Project Status: ') || ['', ''];
            const orgLine = page[7];
            const [projectCity, communityIdentifier, county] = page[11]?.split('\t') || ['', '', ''];
            const [community, region] = communityIdentifier?.split(' CO ') || ['', ''];
            const [projectCity2, communityIdentifier2, county2] = page[10]?.split('\t') || ['', '', ''];
            const [community2, region2] = communityIdentifier2?.split(' CO ') || ['', ''];
            if (isCorrespondence) {
                const correspondenceIndex = page.findIndex(line => line.includes('Correspondence Information'));
                const additionalDataRequestsIndex = page.findIndex(line => line.includes('Additional Data Requests'));
                const rawCorrespondenceInfo = page.slice(correspondenceIndex + 2, additionalDataRequestsIndex);

                const notCorrespondenceFields = [
                    'Date',
                    'Project Workflow Information',
                    'Workflow Process Step',
                    'Actual Completion Date',
                    'Administer Fee',
                    'Assign Project Resource',
                    'Review Data Received',
                    'Process Request',
                    'Receive Additional Data',
                    'Review Data Received',
                    'Process Request',
                    'Receive Additional Data',
                    'Review Data Received',
                ]

                const correspondenceInfo = rawCorrespondenceInfo.filter(line => {
                    for (const field of notCorrespondenceFields) {
                        if (line.includes(field)) {
                            return false;
                        }
                    }
                    return true;
                });

                const finalCorrespondenceInfo: string[] = [];

                for (let i = 0; i < correspondenceInfo.length; i++) {
                    const line = correspondenceInfo[i];

                    if (line?.includes('All Data Received')) {
                        const allDataReceived = line.replace('All Data Received', '').trim();

                        finalCorrespondenceInfo.push(allDataReceived);
                    }

                    if (line?.includes('Request for Additional Data')) {
                        const additionalDataRequest = line;

                        finalCorrespondenceInfo.push(additionalDataRequest);
                    }

                    if (line?.includes('Acknowledge receipt of request/all data')) {
                        const acknowledgement = correspondenceInfo[i + 2] || '';

                        finalCorrespondenceInfo.push(acknowledgement);
                    }

                    if (line?.includes('Determination letter to FEMA')) {
                        const determination = line.replace('Determination letter to FEMA ', '');

                        finalCorrespondenceInfo.push(determination);
                    }
                }

                 correspondence = finalCorrespondenceInfo;
            }
            let projectDueDate = '';
            if (dueDateLine) {
                for (const part of dueDateLine) {
                    if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(part)) {
                        projectDueDate = dueDateLine.pop() || '';
                        break;
                    }
                }
            }
            projects.push({
                projectId: projectName?.trim() || '',
                caseNum: caseNo?.trim() || '',
                received: date || '',
                type: lomcType?.replace('Case Received Date: ', '') || '',
                analystOrEngineer: dueDateLine?.join(' ') || '',
                dueDate: projectDueDate || undefined,
                workGroup: group?.replace('Project Work Group: ', '') || '',
                status: projectStatus || '',
                organization: orgLine?.replace('Organization Name: ', '') || '',
                city: projectCity === 'Flood Source Information' ? cleanCity(projectCity2) || '' : cleanCity(projectCity) || '',
                communityId: community || community2 || '',
                region: region || region2 || '',
                county: county?.replace(' County', '') || county2?.replace(' County', '') || '',
                correspondence,
            });

            continue;
        }
    }

    return projects;
}