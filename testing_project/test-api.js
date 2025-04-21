const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');

// Cấu hình base URL
//const BASE_URL = 'https://phongthuybotbackend.onrender.com'; // Node.js Gateway
 const BASE_URL = 'https://phongthuybotadk.onrender.com'; // Python ADK Service

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printResponse(title, response) {
  console.log(chalk.cyan('\n==================================='));
  console.log(chalk.cyan(`${title}`));
  console.log(chalk.cyan('==================================='));
  console.log(chalk.green('Status:'), response.status);
  console.log(chalk.yellow('Response:'));
  console.log(JSON.stringify(response.data, null, 2));
}

// Test Health Check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    printResponse('Health Check', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Health Check Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Root Info
async function testRootInfo() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    printResponse('Root Info', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Root Info Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Root Agent API Info
async function testAgentInfo() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v2/agent`);
    printResponse('Agent Info', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Agent Info Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Bát Cục Linh Số API Info
async function testBatCucLinhSoInfo() {
  try {
    const response = await axios.get(`${BASE_URL}/api/v2/bat-cuc-linh-so`);
    printResponse('Bát Cục Linh Số Info', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Bát Cục Linh Số Info Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Agent Chat
async function testAgentChat(message) {
  try {
    const payload = {
      message,
      sessionId: `test-session-${Date.now()}`
    };
    
    const response = await axios.post(`${BASE_URL}/api/v2/agent/chat`, payload);
    printResponse('Agent Chat Response', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Agent Chat Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Agent Query
async function testAgentQuery(agentType, query) {
  try {
    const payload = {
      agentType,
      query,
      sessionId: `test-session-${Date.now()}`
    };
    
    const response = await axios.post(`${BASE_URL}/api/v2/agent/query`, payload);
    printResponse('Agent Query Response', response);
    return true;
  } catch (error) {
    console.error(chalk.red('Agent Query Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Agent Stream
async function testAgentStream(message) {
  try {
    const payload = {
      message,
      sessionId: `test-session-${Date.now()}`
    };
    
    console.log(chalk.cyan('\n==================================='));
    console.log(chalk.cyan('Agent Stream Response'));
    console.log(chalk.cyan('==================================='));
    
    const response = await axios.post(`${BASE_URL}/api/v2/agent/stream`, payload, {
      responseType: 'stream'
    });
    
    response.data.on('data', (chunk) => {
      const data = chunk.toString();
      const lines = data.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.substring(6));
            
            if (eventData.type === 'chunk') {
              process.stdout.write(chalk.green(eventData.content));
            } else if (eventData.type === 'complete') {
              console.log(chalk.yellow('\n\nStream completed'));
            } else if (eventData.type === 'error') {
              console.log(chalk.red('\n\nStream error:'), eventData.error);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    });
    
    response.data.on('end', () => {
      console.log(chalk.cyan('\n==================================='));
    });
    
    return true;
  } catch (error) {
    console.error(chalk.red('Agent Stream Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Phone Analysis
async function testPhoneAnalysis(phoneNumber) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v2/bat-cuc-linh-so/phone`, {
      phoneNumber
    });
    
    printResponse(`Phone Analysis: ${phoneNumber}`, response);
    return true;
  } catch (error) {
    console.error(chalk.red('Phone Analysis Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test CCCD Analysis
async function testCCCDAnalysis(cccdNumber) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v2/bat-cuc-linh-so/cccd`, {
      cccdNumber
    });
    
    printResponse(`CCCD Analysis: ${cccdNumber}`, response);
    return true;
  } catch (error) {
    console.error(chalk.red('CCCD Analysis Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Password Analysis
async function testPasswordAnalysis(password) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v2/bat-cuc-linh-so/password`, {
      password
    });
    
    printResponse(`Password Analysis: ${password}`, response);
    return true;
  } catch (error) {
    console.error(chalk.red('Password Analysis Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Bank Account Analysis
async function testBankAccountAnalysis(accountNumber) {
  try {
    const response = await axios.post(`${BASE_URL}/api/v2/bat-cuc-linh-so/bank-account`, {
      accountNumber
    });
    
    printResponse(`Bank Account Analysis: ${accountNumber}`, response);
    return true;
  } catch (error) {
    console.error(chalk.red('Bank Account Analysis Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Test Suggest Bank Account
async function testSuggestBankAccount(purpose, preferredDigits) {
  try {
    const payload = {
      purpose
    };
    
    if (preferredDigits && preferredDigits.length > 0) {
      payload.preferredDigits = preferredDigits;
    }
    
    const response = await axios.post(`${BASE_URL}/api/v2/bat-cuc-linh-so/suggest-bank-account`, payload);
    
    printResponse(`Suggest Bank Account for ${purpose}`, response);
    return true;
  } catch (error) {
    console.error(chalk.red('Suggest Bank Account Error:'), error.message);
    if (error.response) {
      console.error(chalk.red('Response:'), error.response.data);
    }
    return false;
  }
}

// Danh sách các lựa chọn test
const testOptions = [
  { id: 1, name: 'Test Health Check', handler: testHealthCheck },
  { id: 2, name: 'Test Root Info', handler: testRootInfo },
  { id: 3, name: 'Test Agent Info', handler: testAgentInfo },
  { id: 4, name: 'Test Bát Cục Linh Số Info', handler: testBatCucLinhSoInfo },
  { 
    id: 5, 
    name: 'Test Agent Chat', 
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập tin nhắn: ', async (message) => {
          await testAgentChat(message);
          resolve();
        });
      });
    } 
  },
  {
    id: 6,
    name: 'Test Agent Query',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập agent type (batcuclinh_so): ', async (agentType) => {
          const type = agentType || 'batcuclinh_so';
          rl.question('Nhập query: ', async (query) => {
            await testAgentQuery(type, query);
            resolve();
          });
        });
      });
    }
  },
  {
    id: 7,
    name: 'Test Agent Stream',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập tin nhắn: ', async (message) => {
          await testAgentStream(message);
          resolve();
        });
      });
    }
  },
  {
    id: 8,
    name: 'Test Phone Analysis',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập số điện thoại: ', async (phoneNumber) => {
          await testPhoneAnalysis(phoneNumber);
          resolve();
        });
      });
    }
  },
  {
    id: 9,
    name: 'Test CCCD Analysis',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập số CCCD: ', async (cccdNumber) => {
          await testCCCDAnalysis(cccdNumber);
          resolve();
        });
      });
    }
  },
  {
    id: 10,
    name: 'Test Password Analysis',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập mật khẩu: ', async (password) => {
          await testPasswordAnalysis(password);
          resolve();
        });
      });
    }
  },
  {
    id: 11,
    name: 'Test Bank Account Analysis',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập số tài khoản ngân hàng: ', async (accountNumber) => {
          await testBankAccountAnalysis(accountNumber);
          resolve();
        });
      });
    }
  },
  {
    id: 12,
    name: 'Test Suggest Bank Account',
    handler: async () => {
      await new Promise(resolve => {
        rl.question('Nhập mục đích (business, investment, saving, personal): ', async (purpose) => {
          rl.question('Nhập các chữ số ưa thích (cách nhau bởi dấu phẩy, ví dụ: 6,8,9): ', async (digits) => {
            const preferredDigits = digits ? digits.split(',').map(d => d.trim()) : [];
            await testSuggestBankAccount(purpose, preferredDigits);
            resolve();
          });
        });
      });
    }
  },
  {
    id: 13,
    name: 'Test All APIs',
    handler: async () => {
      console.log(chalk.cyan('Running all basic tests...'));
      await testHealthCheck();
      await testRootInfo();
      await testAgentInfo();
      await testBatCucLinhSoInfo();
      await testPhoneAnalysis('0987654321');
      await testCCCDAnalysis('012345678901');
      await testPasswordAnalysis('MyP@ssw0rd123');
      await testBankAccountAnalysis('1903246813574');
      await testSuggestBankAccount('business', ['6', '8', '9']);
      await testAgentChat('Phân tích số điện thoại 0987654321');
      await testAgentQuery('batcuclinh_so', 'Phân tích số CCCD 012345678901');
      console.log(chalk.green('All basic tests completed!'));
    }
  },
  { id: 0, name: 'Thoát', handler: () => process.exit(0) }
];

// Hiển thị menu
function showMenu() {
  console.log(chalk.cyan('\n==================================='));
  console.log(chalk.cyan('PHONG THỦY SỐ API TEST SCRIPT'));
  console.log(chalk.cyan('==================================='));
  console.log(chalk.yellow('Chọn một lựa chọn:'));
  
  testOptions.forEach(option => {
    console.log(`${option.id}. ${option.name}`);
  });
  
  rl.question('Lựa chọn của bạn: ', async (choice) => {
    const selectedOption = testOptions.find(option => option.id === parseInt(choice));
    
    if (selectedOption) {
      await selectedOption.handler();
    } else {
      console.log(chalk.red('Lựa chọn không hợp lệ!'));
    }
    
    // Hiển thị menu lại sau khi hoàn thành test
    showMenu();
  });
}

// Bắt đầu script
console.log(chalk.green('Bắt đầu test API Phong Thủy Số'));
console.log(chalk.yellow(`Base URL: ${BASE_URL}`));
showMenu(); 
