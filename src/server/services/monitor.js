const os = require('os');
const mongoose = require('mongoose');

class MonitorService {
  constructor() {
    this.metrics = {
      system: {},
      database: {},
      application: {}
    };
    
    this.startMonitoring();
  }

  startMonitoring() {
    // 系统资源监控
    setInterval(() => {
      this.collectSystemMetrics();
    }, 60000);

    // 数据库监控
    setInterval(() => {
      this.collectDatabaseMetrics();
    }, 300000);

    // 应用性能监控
    this.setupApplicationMetrics();
  }

  collectSystemMetrics() {
    const metrics = {
      cpuUsage: os.loadavg()[0],
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime()
    };

    this.metrics.system = metrics;
  }

  async collectDatabaseMetrics() {
    try {
      const stats = await mongoose.connection.db.stats();
      const metrics = {
        collections: stats.collections,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize
      };

      this.metrics.database = metrics;
    } catch (error) {
      console.error('获取数据库指标失败:', error);
    }
  }

  setupApplicationMetrics() {
    // 请求计数器
    this.requestCount = 0;
    // 错误计数器
    this.errorCount = 0;
    // 响应时间记录
    this.responseTimes = [];
  }

  recordRequest() {
    this.requestCount++;
  }

  recordError(error) {
    this.errorCount++;
    console.error('应用错误:', error);
  }

  recordResponseTime(time) {
    this.responseTimes.push(time);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  getMetrics() {
    const avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    return {
      ...this.metrics,
      application: {
        requestCount: this.requestCount,
        errorCount: this.errorCount,
        avgResponseTime,
        activeConnections: mongoose.connection.base.connections.length
      }
    };
  }
}

module.exports = new MonitorService(); 