import { User, Project, IDCard } from "@/contexts/AppContext";

// Generate the HTML for ID card with improved alignment
export const generateIDCardHTML = (
  user: User,
  project?: Project,
  cardStatus?: string,
) => {
  const safetyIcons = `
    <div style="display: flex; justify-content: space-around; margin: 2px 0; padding: 0 5px; flex-wrap: wrap; align-items: flex-start;">
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
            <path d="M6 19h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2z"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Safety Shoes</span>
      </div>
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
            <path d="M10 18v-7a4 4 0 0 1 4-4h.5"></path>
            <path d="M16 19v2"></path>
            <path d="M8 19v2"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Helmet</span>
      </div>
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 14h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5"></path>
            <path d="M21 14h-3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1"></path>
            <path d="M18 3v16"></path>
            <path d="M6 3v16"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Earmuff</span>
      </div>
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.17 8H2.83A2 2 0 0 0 1 10.17v3.66A2 2 0 0 0 2.83 16h18.34A2 2 0 0 0 23 13.83v-3.66A2 2 0 0 0 21.17 8Z"></path>
            <path d="m16 8-4-4-4 4"></path>
            <path d="M12 4v8"></path>
            <path d="M8 16v4a2 2 0 0 0 4 0v-4"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Goggles</span>
      </div>
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15.6 13.5c.9 0 1.6-.7 1.6-1.6v-1.8c0-.9-.7-1.6-1.6-1.6H8.4c-.9 0-1.6.7-1.6 1.6v1.8c0 .9.7 1.6 1.6 1.6h7.2Z"></path>
            <path d="M8.4 13.5V18h7.2v-4.5"></path>
            <path d="M12 13.5V18"></path>
            <path d="M13.9 7.5c-.9-.9-2.1-1.4-3.3-1.5"></path>
            <path d="M10.1 7.5c.9-.9 2.1-1.4 3.3-1.5"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Nose Mask</span>
      </div>
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; width: 12mm;">
        <div style="width: 10mm; height: 10mm; background-color: #0066ff; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 14.3c.4.7 1 1.2 1.8 1.5m6.4 0c.8-.2 1.4-.8 1.8-1.5"></path>
            <path d="M14 8.5c.5.3 1 .4 1.5.5"></path>
            <path d="M10 8.5c-.5.3-1 .4-1.5.5"></path>
            <path d="M19 7.9c-.2-1-1-1.7-1.9-2l-7-2.2c-.6-.2-1.2-.2-1.8 0l-7 2.2C.4 6.2-.3 7 .1 8s1 1.7 1.9 2l7 2.2c.6.2 1.2.2 1.8 0l7-2.2c1-.3 1.7-1.1 1.9-2z"></path>
            <path d="M20 13c-.2 1.5-.4 3-1 4"></path>
            <path d="M4 13c.2 1.5.4 3 1 4"></path>
          </svg>
        </div>
        <span style="font-size: 5pt; color: blue; font-weight: bold; text-align: center; line-height: 1; word-wrap: break-word; max-width: 12mm;">Hand Gloves</span>
      </div>
    </div>
  `;

  return `
    <div style="width: 210mm; height: 148mm; display: flex; font-family: Arial, sans-serif; background-color: white; justify-content: center; align-items: flex-start; gap: 10mm; padding: 10mm; box-sizing: border-box; margin: 0; position: relative;">
      <!-- Front card -->
      <div style="width: 85mm; height: 54mm; border: 2px solid #000; position: relative; box-sizing: border-box; background-color: white; display: flex; flex-direction: column; flex-shrink: 0;">
        <!-- Header -->
        <div style="background: #337688; color: white; text-align: center; padding: 3px 2px; width: 100%; box-sizing: border-box; flex-shrink: 0;">
          <div style="font-size: 8pt; font-weight: bold; line-height: 1.1; margin-bottom: 1px;">Activus Industrial Design & Build LLP</div>
          <div style="font-size: 6pt; line-height: 1.1; margin-bottom: 1px;">One Stop Solution is What We do</div>
          <div style="color: #ffff00; font-weight: bold; font-size: 7pt; line-height: 1.1;">CONTRACTOR ACCESS CARD</div>
        </div>
        
        <!-- Photo and employee info section -->
        <div style="display: flex; height: 25mm; box-sizing: border-box; flex-shrink: 0;">
          <!-- Left column for photo -->
          <div style="width: 20mm; border-right: 1px solid #000; border-bottom: 1px solid #000; display: flex; flex-direction: column; align-items: center; padding: 2px; box-sizing: border-box;">
            <div style="font-size: 5pt; color: black; font-weight: bold; margin-bottom: 2px; flex-shrink: 0;">PHOTO</div>
            <div style="flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 0;">
              ${user.photo
      ? `<img src="${user.photo}" style="max-width: 100%; max-height: 100%; object-fit: cover; border: 1px solid #ccc; display: block;">`
      : `<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc;">
                     <span style="font-size: 5pt; color: #666;">No Photo</span>
                   </div>`
    }
            </div>
          </div>
          
          <!-- Right column for information -->
          <div style="flex: 1; display: flex; flex-direction: column; box-sizing: border-box; min-width: 0;">
            <!-- Name row -->
            <div style="border-bottom: 1px solid #000; padding: 2px 4px; height: 6mm; display: flex; align-items: center; box-sizing: border-box; flex-shrink: 0;">
              <span style="color: purple; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">NAME OF WORKER:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; min-width: 0;">${user.name || ""}</span>
            </div>
            
            <!-- Contractor row -->
            <div style="border-bottom: 1px solid #000; padding: 2px 4px; height: 10mm; display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex-shrink: 0;">
              <span style="color: purple; font-weight: bold; font-size: 5pt; margin-bottom: 1px; flex-shrink: 0;">CONTRACTOR NAME & ADDRESS:</span>
              <div style="font-weight: bold; font-size: 5pt; line-height: 1.1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; flex: 1; min-height: 0;">
                ${user.contractor || ""}
              </div>
            </div>
            
            <!-- UID and ID row -->
            <div style="border-bottom: 1px solid #000; padding: 2px 4px; height: 6mm; display: flex; align-items: center; box-sizing: border-box; flex-shrink: 0;">
              <div style="width: 50%; padding-right: 2px; min-width: 0; box-sizing: border-box;">
                <span style="color: purple; font-weight: bold; font-size: 6pt;">Project:</span>
                <span style="font-weight: bold; font-size: 6pt; word-break: break-word;">${project?.name || ""}</span>
              </div>
              <div style="width: 50%; padding-left: 2px; border-left: 1px solid #ccc; min-width: 0; box-sizing: border-box;">
                <span style="color: purple; font-weight: bold; font-size: 6pt;">ID NO.:</span>
                <span style="font-weight: bold; font-size: 6pt; word-break: break-word;">${user.idNo || ""}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Information table -->
        <div style="flex: 1; display: flex; flex-direction: column; box-sizing: border-box; min-height: 0;">
          <!-- Row 1 -->
          <div style="display: flex; flex: 1; border-bottom: 1px solid #000; min-height: 0;">
            <div style="width: 50%; border-right: 1px solid #000; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">EMERGENCY CONTACT:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; min-width: 0;">${user.emergencyContact || ""}</span>
            </div>
            <div style="width: 50%; padding: 2px; display: flex; align-items: center; box-sizing: border-box;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">SAFETY VIOLATION:</span>
              <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${user.safetyViolation || "white"}; border: 1px solid black; flex-shrink: 0;"></div>
            </div>
          </div>
          
          <!-- Row 2 -->
          <div style="display: flex; flex: 1; border-bottom: 1px solid #000; min-height: 0;">
            <div style="width: 50%; border-right: 1px solid #000; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">DATE OF INDUCTION:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; word-break: break-word; min-width: 0;">${user.inductionDate ? new Date(user.inductionDate).toLocaleDateString() : ""}</span>
            </div>
            <div style="width: 50%; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">VALID TILL:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; word-break: break-word; min-width: 0;">${user.validTill ? new Date(user.validTill).toLocaleDateString() : ""}</span>
            </div>
          </div>
          
          <!-- Row 3 -->
          <div style="display: flex; flex: 1; border-bottom: 1px solid #000; min-height: 0;">
            <div style="width: 50%; border-right: 1px solid #000; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">DATE OF BIRTH:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; word-break: break-word; min-width: 0;">${user.dob ? new Date(user.dob).toLocaleDateString() : ""}</span>
            </div>
            <div style="width: 50%; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">Health checkup date:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; word-break: break-word; min-width: 0;">${user.healthCheckupDate ? new Date(user.healthCheckupDate).toLocaleDateString() : ""}</span>
            </div>
          </div>
          
          <!-- Row 4 -->
          <div style="display: flex; flex: 1; min-height: 0;">
            <div style="width: 50%; border-right: 1px solid #000; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">HR EXECUTIVE:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; min-width: 0;">${user.hrExecutive || ""}</span>
            </div>
            <div style="width: 50%; padding: 2px; display: flex; align-items: center; box-sizing: border-box; min-width: 0;">
              <span style="color: blue; font-weight: bold; font-size: 6pt; margin-right: 4px; flex-shrink: 0;">SAFETY INCHARGE:</span>
              <span style="font-weight: bold; font-size: 6pt; flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; min-width: 0;">${user.safetyIncharge || ""}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Back card -->
      <div style="width: 85mm; height: 54mm; border: 2px solid #000; position: relative; box-sizing: border-box; background-color: white; display: flex; flex-direction: column; flex-shrink: 0;">
        <!-- Header -->
        <div style="background: #337688; color: white; text-align: center; padding: 3px 2px; flex-shrink: 0;">
          <div style="font-weight: bold; font-size: 7pt;">SAFETY INSTRUCTIONS</div>
        </div>
        
        <!-- Instructions section -->
        <div style="padding: 3px; font-size: 6pt; text-align: left; flex: 1; display: flex; flex-direction: column; min-height: 0;">
          <ol style="margin: 0; padding-left: 12px; line-height: 1.2; flex: 1; list-style-position: outside;">
            <li style="margin-bottom: 1px;">1.Smoking & Consuming Alcohol Strictly Prohibited.</li>
            <li style="margin-bottom: 1px;">2.Carrying of Match-box, lighter, cigarettes, bidi, gutka is strictly prohibited.</li>
            <li style="margin-bottom: 1px;">3.Take notice of nearest assembly point.</li>
            <li style="margin-bottom: 1px;">4.If you hear emergency siren leave the job & proceed to assembly point.</li>
            <li style="margin-bottom: 1px;">5.Any person found violating the site safety rules will be removed from the site.</li>
            <li style="margin-bottom: 1px;">6.Use the following personal protective equipments as required:</li>
            <li style="margin-bottom: 1px;">7.Please get the card validated periodically</li>
          </ol>
        </div>
        
        <!-- Safety Icons section -->
        <div style="flex-shrink: 0;">
          ${safetyIcons}
        </div>
        
        <!-- Status Watermark -->
        ${cardStatus && cardStatus !== "generated"
      ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
               font-size: 20pt; color: rgba(255, 0, 0, 0.3); font-weight: bold; text-transform: uppercase; z-index: 10; pointer-events: none;">
               ${cardStatus}
             </div>`
      : ""
    }
        
        <!-- Validation Table -->
        <div style="margin: 3px; flex-shrink: 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 6pt; table-layout: fixed;">
            <tr>
              <th style="border: 1px solid #000; padding: 1px; background-color: #f2f2f2; color: purple; width: 20%; text-align: center; box-sizing: border-box;">INDUCTION</th>
              <th style="border: 1px solid #000; padding: 1px; background-color: #f2f2f2; color: purple; width: 20%; text-align: center; box-sizing: border-box;">SAFETY</th>
              <th style="border: 1px solid #000; padding: 1px; background-color: #f2f2f2; color: purple; width: 20%; text-align: center; box-sizing: border-box;">SECURITY</th>
              <th style="border: 1px solid #000; padding: 1px; background-color: #f2f2f2; color: purple; width: 20%; text-align: center; box-sizing: border-box;">HRD</th>
              <th style="border: 1px solid #000; padding: 1px; background-color: #f2f2f2; color: purple; width: 20%; text-align: center; box-sizing: border-box;">ADMIN</th>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 1px; height: 6mm; box-sizing: border-box;"></td>
              <td style="border: 1px solid #000; padding: 1px; height: 6mm; box-sizing: border-box;"></td>
              <td style="border: 1px solid #000; padding: 1px; height: 6mm; box-sizing: border-box;"></td>
              <td style="border: 1px solid #000; padding: 1px; height: 6mm; box-sizing: border-box;"></td>
              <td style="border: 1px solid #000; padding: 1px; height: 6mm; box-sizing: border-box;"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `;
};
